import { Request, Response } from "express";
import { bookingInterfaceType } from "../../app/repositories/bookingDBInterface";
import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { BookingModelType } from "../../frameworks/database/mongodb/models/bookingModel";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import expressAsyncHandler from "express-async-handler";
import { findCar, viewCarDetails } from "../../app/use_case/car/car";
import { createBooking, findBooking } from "../../app/use_case/booking/booking";
import { Booking } from "../../types/bookingInterface";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { findOneUser } from "../../app/use_case/adminUser/adminUser";
import { carInterface } from "../../types/carInterface";
import { findUser } from "../../app/use_case/auth/userAuth";

export const bookingController = (
    bookingInterface : bookingInterfaceType,
    bookingDBRepository : bookingRepositoryType,
    bookingModel : BookingModelType,
    carInterface : carInterfaceType,
    carRepository: CarRepoType,
    carModel: carModelType,
    userModel: userModelType,
    userInterface: userDbInterface,
    userRepository: userRepository
)=>{
    
    const bookingService = bookingInterface(bookingDBRepository(bookingModel))
    const carService = carInterface(carRepository(carModel))
    const userService = userInterface(userRepository(userModel))


    const creatingBooking = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const data : Booking = req.body.data
            console.log("data :" , data)
            const carAvailable = await viewCarDetails(data.carId, carService)
            if(carAvailable && 'message' in carAvailable){
                res.json({
                    status: "failed",
                    message: carAvailable.message
                })
            }
            else
            {
                const BookingCreation = await createBooking(data, bookingService)
                res.json({
                    status:"success",
                    BookingCreation
                })
            }
        }
    )

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

    return {
        creatingBooking, 
        filteringCarsBooking
    }
}