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
import { paymentInterface } from "../../../app/services/paymentInterface";
import { paymentService } from "../../services/paymentService";
import couponInterface from "../../../app/repositories/couponInterface";
import { couponRepository } from "../../database/mongodb/repositories/couponRepository";
import { couponModel } from "../../database/mongodb/models/couponModel";

export const bookingRoute = ()=>{
    const controller = bookingController(bookingDBInterface, 
        bookingRepository, 
        bookingModel, 
        carRepoInterface, 
        carRepository, 
        carModel,
        usersModel,
        userdbRepository,
        userRepository,
        paymentInterface,
        paymentService,
        couponInterface,
        couponRepository,
        couponModel
        )

    const router = express.Router()
    
    router.get('/findBookings', controller.findBookings)
    router.post('/payment', controller.bookingPaymentUI)
    router.post('/BasedOnRole', controller.bookingFindingBasedOnRole)
    router.get('/redirect-to', controller.bookingCompletion)
    router.patch('/updater', controller.bookingUpdater)
    router.patch('/rescheduler', controller.bookingRescheduler)
    router.patch('/bookCarReport', controller.carReportHandler)
    router.get('/topBookedCars', controller.topBookedCars)
    router.get('/pagination', controller.paginationBooking)
    return router
    
}