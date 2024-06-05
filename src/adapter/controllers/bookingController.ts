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
import { Booking, Refund, RefundDetails, SessionDataInterface, bookingDetail } from "../../types/bookingInterface";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { findOneUser } from "../../app/use_case/adminUser/adminUser";
import { carInterface } from "../../types/carInterface";
import { findUser } from "../../app/use_case/auth/userAuth";
import { paymentInterfaceType } from "../../app/services/paymentInterface";
import { paymentServiceType } from "../../frameworks/services/paymentService";
import { error } from "console";
import { couponInterfaceType } from "../../app/repositories/couponInterface";
import { couponModelType } from "../../frameworks/database/mongodb/models/couponModel";
import { couponRepositoryType } from "../../frameworks/database/mongodb/repositories/couponRepository";
import { findAllCoupon } from "../../app/use_case/coupon/coupon";
import { couponInterface } from "../../types/couponInetrface";
import { userInterface } from "../../types/userInterface";
import { updateUser } from "../../app/use_case/user/user";
import { ObjectId, Types } from "mongoose";

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
    paymentServices: paymentServiceType,
    couponInterface: couponInterfaceType,
    couponRepository: couponRepositoryType,
    couponModel: couponModelType
)=>{
    
    const bookingService = bookingInterface(bookingDBRepository(bookingModel))
    const carService = carInterface(carRepository(carModel))
    const userService = userInterface(userRepository(userModel))
    const paymentService = paymentInterface(paymentServices())
    const couponService = couponInterface(couponRepository(couponModel))

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
            console.log(session_id)

            paymentDetail.bookingDetails = JSON.parse(decodedBooking)
            
            const carId = paymentDetail.carId
            const carDetails = await findCar(carId, carService) as carInterface

            const sesssionVerification = await stripePaymentVeification(session_id, paymentService)

            if(sesssionVerification){
                paymentDetail.transactionId = session_id
            }
            console.log(paymentDetail)

            const bookingId = paymentDetail.bookingDetails.bookingId || ''
            const booking = await findBooking(bookingId, bookingService)
           
            if(booking !== null){
                
                const bookingData = paymentDetail.bookingDetails
                console.log(bookingData.total, bookingData.startDate, bookingData.endDate, session_id)
                if(bookingData.total && bookingData.startDate && bookingData.endDate){
                    const data : Partial<Booking> = {
                        transaction : {
                            transactionId: session_id,
                            amount: bookingData.total || 0,
                        }, 
                        date:{
                            start: new Date(bookingData.startDate),
                            end: new Date(bookingData.endDate)
                        },
                        _id:bookingData.bookingId
                    }
                    
                    const updateBooking = await BookingUpdater(data, bookingService)
                    console.log(updateBooking)
                    if(updateBooking !== null){
                        const message = encodeURIComponent(`Your booking has been successfully rescheduled to start on ${new Date(bookingData.startDate).toISOString()} and end on ${new Date(bookingData.endDate).toISOString()}.`);
                        const redirectUrl = `http://localhost:5173/users/BookedCars?message=${message}&status=success`;
                        res.redirect(redirectUrl)
                    }
                } else {
                    res.json({
                        error:"no necessary data found",
                        status: "failed"
                    })
                }
                
            } else {
                
                const bookingCreation = await createBooking(paymentDetail, carDetails,bookingService)
                
                    if(bookingCreation !== null){
                        const price = bookingCreation.transaction.amount
                        const AllCoupons = await findAllCoupon(couponService)
                        
                        if (AllCoupons && AllCoupons.length > 0) {
                            const matchedCoupons = AllCoupons.filter(coupon => {
                              return coupon.ApplyPrice.minApply <= price && coupon.ApplyPrice.maxApply >= price;
                            });
                            
                            if(matchedCoupons.length > 0){
                                const data: Partial<userInterface> = {
                                    _id: new Types.ObjectId(bookingCreation.userId),
                                    coupons:matchedCoupons
                                }
                                const userUpdate = await updateUser(data, userService)

                                if(userUpdate === null){
                                    res.json({
                                        messgae: 'cannot apply coupon',
                                        status: 'failed'
                                    })
                                }
                            }
                          }
                        
                        const data = JSON.stringify(bookingCreation)
                        const update : Partial<carInterface> = {status:'booked'}
                        const statusUpdateCar = await updateCar(carId, update, carService)
                        if(statusUpdateCar){
                            res.redirect(`http://localhost:5173/TransactionSuccess?bokingDetail=${data}&car=${carDetails}`)
                        } else {
                            res.json({
                                statusUpdateCar
                            })
                        }
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
            res.json({
                data: findBooking
            })
        }
    )

    const bookingUpdater = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { data, purpose } = req.body;
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
                
                if (update.status === 'Cancelled' && purpose ==='refund') {

                    const refund: Partial<RefundDetails> = await stripeRefund(update, paymentService);
                    const refundData : Refund = {
                        Amount: refund.amount as number,
                        paymentId: refund.transactionId as string,
                        createdAt: new Date(),
                        updatedAt: new Date(),

                    }
                    const userId = new Types.ObjectId(booking.userId)
                    const data : Partial<userInterface> = {
                        _id: userId ,
                        refund:[refundData]
                    }
                    const userRefundUpdate = await updateUser(data, userService)
                    if(!userRefundUpdate){
                        res.json({error:"refund Failed", status: "failed"})
                    }
                    
                    if (typeof booking.carId === 'object') {
                        refund.bookingDetail = {
                            itemName: booking.carId.name ?? '',
                            thumbnail: booking.carId.thumbnailImg ?? ''
                        };
                    }

                    
                    res.json({
                        message: "Refund success",
                        data: refund
                    });
                } else {

                    res.json({
                        message:"booking update successfull",
                        status: "success"
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

    const bookingRescheduler = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { data, userId } = req.body;
            const datas: Partial<bookingDetail> = data;
    
            
            const bookingId = datas.bookingId || '';
            if (!bookingId) {
                res.status(400).json({
                    message: "Booking ID is required",
                    status: 'failed'
                });
                return;
            }
    
            const booking = await findBooking(bookingId, bookingService);
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
                res.status(400).json({
                    message: "Booking is already cancelled, no further action can be taken.",
                    status: 'failed'
                });
                return;
            }
    
            if (datas && typeof datas.carId === 'object') {
                const carId = datas.carId._id;
                if (carId && typeof carId === 'string') {
                    const carData = await findCar(carId, carService);
    
                    if (!carData) {
                        res.status(400).json({
                            message: "Car not found",
                            status: 'failed'
                        });
                        return;
                    }
    
                    const payment = await bookingPayment(datas, carData, userId, paymentService);
                    res.json({
                        sessionId: payment
                    });
                    return;
                } else {
                    res.status(400).json({
                        message: "Invalid car ID",
                        status: 'failed'
                    });
                    return;
                }
            } else {
                res.status(400).json({
                    message: "Car ID is required",
                    status: 'failed'
                });
                return;
            }
        }
    );

    return {
        bookingUpdater,
        bookingFindingBasedOnRole,
        filteringCarsBooking,
        findBookings,
        bookingPaymentUI,
        bookingCompletion,
        bookingRescheduler
    }
}