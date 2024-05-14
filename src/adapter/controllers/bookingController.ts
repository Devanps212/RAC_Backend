import { Request, Response } from "express";
import { bookingInterfaceType } from "../../app/repositories/bookingDBInterface";
import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { BookingModelType } from "../../frameworks/database/mongodb/models/bookingModel";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import expressAsyncHandler from "express-async-handler";
import { findCar, updateCar, viewCarDetails } from "../../app/use_case/car/car";
import { bookingPayment, createBooking, findBooking, bookingBasedOnRole, BookingUpdater, stripePaymentVeification, stripeRefund } from "../../app/use_case/booking/booking";
import { Booking, RefundDetails, SessionDataInterface, bookingDetail } from "../../types/bookingInterface";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { findOneUser } from "../../app/use_case/adminUser/adminUser";
import { carInterface } from "../../types/carInterface";
import { findUser } from "../../app/use_case/auth/userAuth";
import { paymentInterfaceType } from "../../app/services/paymentInterface";
import { paymentServiceType } from "../../frameworks/services/paymentService";

export const bookingController = (
    bookingInterface : bookingInterfaceType,
    bookingDBRepository : bookingRepositoryType,
    bookingModel : BookingModelType,
    carInterface : carInterfaceType,
    carRepository: CarRepoType,
    carModel: carModelType,
    userModel: userModelType,
    userInterface: userDbInterface,
    userRepository: userRepository,
    paymentInterface: paymentInterfaceType,
    paymentServices: paymentServiceType
)=>{
    
    const bookingService = bookingInterface(bookingDBRepository(bookingModel))
    const carService = carInterface(carRepository(carModel))
    const userService = userInterface(userRepository(userModel))
    const paymentService = paymentInterface(paymentServices())

    const filteringCarsBooking = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            console.log(req.query)
            const { pickupLocation, dropOffLocation, startDate, endDate, pickupTime, dropOffTime } = req.query;
            const finDcars = await findCar('all', carService) as carInterface[]
            const Bookings = await findBooking('all', bookingService) as Booking
            if(finDcars){
                const ownerId = finDcars.map((car : carInterface)=>car.addedById as string)
                const findUsersPromises = ownerId.map(id=> findUser(id, userService))
                console.log(findUsersPromises)
                
            }
        }
    )

    const findBookings = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const data = req.query.bookingData
            console.log("data  found : ",data)
            if (typeof data === 'string') { 
                const findingBookings = await findBooking(data, bookingService);
                res.json({
                    data: findingBookings
                });
            } else {
                res.status(400).json({ message: 'Invalid data provided' }); 
            }
        }
    )

    const bookingPaymentUI = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const { dataString, carId, userId } = req.body
            const bookingDetail = JSON.parse(dataString)
            const carData = await findCar(carId, carService)
            const payment = await bookingPayment(bookingDetail, carData, userId, paymentService)
            req.session.userData = payment as string
            res.json({
                sessionId : payment
            })

        }
    )

    const bookingCompletion = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const {val, bookingDetail, session_id} = req.query
            
            if(typeof val === 'string' &&  typeof bookingDetail === 'string' && typeof session_id === 'string'){ 
            const decodedVal = decodeURIComponent(val);
            const decodedBooking = decodeURIComponent(bookingDetail)
            const paymentDetail: SessionDataInterface = JSON.parse(decodedVal);

            paymentDetail.bookingDetails = JSON.parse(decodedBooking)
            
            const carId = paymentDetail.carId
            const carDetails = await findCar(carId, carService) as carInterface

            const sesssionVerification = await stripePaymentVeification(session_id, paymentService)

            if(sesssionVerification){
                paymentDetail.transactionId = session_id
            }

            const bookingCreation = await createBooking(paymentDetail, carDetails,bookingService)

            if(bookingCreation !== null){
                const data = JSON.stringify(bookingCreation)
                const update : Partial<carInterface> = {status:'booked'}
                const statusUpdateCar = await updateCar(carId, update, carService)
                if(statusUpdateCar){
                    res.redirect(`http://localhost:5173/users/TransactionSuccess?bokingDetail=${data}&car=${carDetails}`)
                } else {
                    res.json({
                        statusUpdateCar
                    })
                }
            }
            
            }
        }
    )

    const bookingFindingBasedOnRole = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const { bookingData } = req.body
            console.log(bookingData)
            const findBooking = await bookingBasedOnRole(bookingData, bookingService)
            console.log("booking : ", findBooking)
            res.json({
                data: findBooking
            })
        }
    )

    const bookingUpdater = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { data } = req.body;
            const bookingDetail: Partial<Booking> = data;
            
            if (bookingDetail && bookingDetail._id) {
                const booking = await findBooking(bookingDetail._id, bookingService);
                
                if (!booking || (booking && 'message' in booking)) {
                    res.status(404).json({
                        message: booking?.message || "Booking not found",
                        status: 'failed'
                    });
                    return;
                }
                
                if (Array.isArray(booking)) {
                    res.status(400).json({
                        message: "Expected a single booking, but received an array.",
                        status: 'failed'
                    });
                    return;
                }

                if (booking.status === 'Cancelled') {
                    console.log("booking is already cancelled")
                    res.status(400).json({
                        message: "Booking is already cancelled, no further action can be taken.",
                        status: 'failed'
                    });
                    return;
                }
    
                const update = await BookingUpdater(bookingDetail, bookingService);
    
                if (!update || (update && 'message' in update)) {
                    res.status(404).json({
                        message: update?.message || "Failed to update booking",
                        status: 'failed'
                    });
                    return;
                }
    
                if (update.status === 'Cancelled') {
                    console.log("status is cancelled, processing refund");
                    const refund: Partial<RefundDetails> = await stripeRefund(update, paymentService);
    
                    console.log("booking car : ", booking.carId)
                    if (typeof booking.carId === 'object') {
                        refund.bookingDetail = {
                            itemName: booking.carId.name ?? '',
                            thumbnail: booking.carId.thumbnailImg ?? ''
                        };
                    }

                    console.log("refund success data : ",refund )
                    res.json({
                        message: "Refund success",
                        data: refund
                    });
                } else {
                    res.json({
                        message:"booking failed to cancel",
                        status: "failed"
                    });
                }
            } else {
                res.status(400).json({
                    message: "Booking ID is required",
                    status: 'failed'
                });
            }
        }
    );

    return {
        bookingUpdater,
        bookingFindingBasedOnRole,
        filteringCarsBooking,
        findBookings,
        bookingPaymentUI,
        bookingCompletion
    }
}