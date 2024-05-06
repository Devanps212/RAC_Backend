import { bookingModel } from "../../database/mongodb/models/bookingModel";
import { bookingDBInterface } from "../../../app/repositories/bookingDBInterface";
import { bookingRepository } from "../../database/mongodb/repositories/bookingRepository";
import { carModel } from "../../database/mongodb/models/carModel";
import { carRepository } from "../../database/mongodb/repositories/carRepository";
import { carRepoInterface } from "../../../app/repositories/carRepoInterface";
import { bookingController } from "../../../adapter/controllers/bookingController";
import { usersModel } from "../../database/mongodb/models/userModel";
import { userdbRepository } from "../../../app/repositories/userDbrepository";
import { userRepository } from "../../database/mongodb/repositories/userRepositoryMongo";
import express from 'express'

export const bookingRoute = ()=>{
    const controller = bookingController(bookingDBInterface, 
        bookingRepository, 
        bookingModel, 
        carRepoInterface, 
        carRepository, 
        carModel,
        usersModel,
        userdbRepository,
        userRepository
        )

    const router = express.Router()

    router.post('/rentBooking', controller.creatingBooking)
    router.get('/filterForBooking', controller.filteringCarsBooking)
    router.get('/findBookings', controller.findBookings)

    return router
    
}