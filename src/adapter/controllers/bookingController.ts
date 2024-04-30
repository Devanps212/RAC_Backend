import { Request, Response } from "express";
import { bookingInterfaceType } from "../../app/repositories/bookingDBInterface";
import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { BookingModelType } from "../../frameworks/database/mongodb/models/bookingModel";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import expressAsyncHandler from "express-async-handler";
import { viewCarDetails } from "../../app/use_case/car/car";
import { createBooking } from "../../app/use_case/booking/booking";
import { Booking } from "../../types/bookingInterface";

export const bookingController = (
    bookingInterface : bookingInterfaceType,
    bookingDBRepository : bookingRepositoryType,
    bookingModel : BookingModelType,
    carInterface : carInterfaceType,
    carRepository: CarRepoType,
    carModel: carModelType
)=>{
    
    const bookingService = bookingInterface(bookingDBRepository(bookingModel))
    const carService = carInterface(carRepository(carModel))

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

    return {
        creatingBooking
    }
}