import { Request, Response } from "express";
import { bookingInterfaceType } from "../../app/repositories/bookingDBInterface";
import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { BookingModelType } from "../../frameworks/database/mongodb/models/bookingModel";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import expressAsyncHandler from "express-async-handler";
import { findCar, updateCar, viewCarDetails } from "../../app/use_case/car/car";
import { bookingPayment, createBooking, findBooking, bookingBasedOnRole, BookingUpdater } from "../../app/use_case/booking/booking";
import { Booking, SessionDataInterface, bookingDetail } from "../../types/bookingInterface";
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


    // const creatingBooking = expressAsyncHandler(
    //     async(req: Request, res: Response)=>{
    //         const data : Booking = req.body.data
    //         console.log("data :" , data)
    //         const carAvailable = await viewCarDetails(data.carId, carService)
    //         if(carAvailable && 'message' in carAvailable){
    //             res.json({
    //                 status: "failed",
    //                 message: carAvailable.message
    //             })
    //         }
    //         else
    //         {
    //             const BookingCreation = await createBooking(data, bookingService)
    //             res.json({
    //                 status:"success",
    //                 BookingCreation
    //             })
    //         }
    //     }
    // )

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
            console.log(req.body)
            const { dataString, carId, userId } = req.body
            const bookingDetail = JSON.parse(dataString)
            const carData = await findCar(carId, carService)
            const payment = await bookingPayment(bookingDetail, carData, userId, paymentService)
            console.log("payment : ", payment)
            res.json({
                sessionId : payment
            })

        }
    )

    const bookingCompletion = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const {val, bookingDetail} = req.query
            console.log(val, bookingDetail)
            if(typeof val === 'string' &&  typeof bookingDetail === 'string'){
            const decodedVal = decodeURIComponent(val);
            const decodedBooking = decodeURIComponent(bookingDetail)
            const paymentDetail: SessionDataInterface = JSON.parse(decodedVal);
            paymentDetail.bookingDetails = JSON.parse(decodedBooking)
            const carId = paymentDetail.carId
            console.log("paymentDetail : ",paymentDetail)
            const carDetails = await findCar(carId, carService) as carInterface
            const bookingCreation = await createBooking(paymentDetail, carDetails,bookingService)
            if(bookingCreation !== null){
                console.log(bookingCreation)
                const data = JSON.stringify(bookingCreation)
                const update : Partial<carInterface> = {status:'booked'}
                const statusUpdateCar = await updateCar(carId, update, carService)
                console.log("updated detail : ", statusUpdateCar)
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
        async(req: Request, res: Response)=>{
            const {data} = req.body
            const bookingDetail : Partial<Booking> = data
            if(bookingDetail && bookingDetail._id){
                const booking = await findBooking(bookingDetail._id, bookingService)
                if(booking && 'message' in booking ){
                    res.status(404).json({
                        message: booking.message,
                        status: 'failed'
                    })
                } else {
                    const update = await BookingUpdater(bookingDetail, bookingService)
                    if(update && 'message' in update){
                        res.status(404).json({
                            message: update.message,
                            status: 'failed'
                        })
                    } else {
                        res.json({
                            data:update,
                            status: "success"
                        })
                    }
                }
            }
            
        }
    )
    return {
        bookingUpdater,
        bookingFindingBasedOnRole,
        filteringCarsBooking,
        findBookings,
        bookingPaymentUI,
        bookingCompletion
    }
}