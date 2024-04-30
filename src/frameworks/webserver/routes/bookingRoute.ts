import { bookingModel } from "../../database/mongodb/models/bookingModel";
import { bookingDBInterface } from "../../../app/repositories/bookingDBInterface";
import { bookingRepository } from "../../database/mongodb/repositories/bookingRepository";
import { carModel } from "../../database/mongodb/models/carModel";
import { carRepository } from "../../database/mongodb/repositories/carRepository";
import { carRepoInterface } from "../../../app/repositories/carRepoInterface";
import { bookingController } from "../../../adapter/controllers/bookingController";
import express from 'express'

export const bookingRoute = ()=>{
    const controller = bookingController(bookingDBInterface, bookingRepository, bookingModel, carRepoInterface, carRepository, carModel)

    const router = express.Router()

    router.post('/rentBooking', controller.creatingBooking)

    return router
    
}