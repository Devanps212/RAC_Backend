import express from 'express'
import { carController } from '../../../adapter/controllers/carController'
import { carRepository } from '../../database/mongodb/repositories/carRepository'
import { carRepoInterface } from '../../../app/repositories/carRepoInterface'
import { carModel } from '../../database/mongodb/models/carModel'
import upload from '../../../app/services/multerService'
import { authentication } from '../middlewares/authenticationMidddleware'
import { authService } from '../../services/authServices'
import { interfaceAuthService } from '../../../app/services/authServiceInterface'

export const carRoute = ()=>{
    const controller = carController(carRepoInterface, carRepository, carModel, authService, interfaceAuthService) 
    const router = express.Router()

    router.post('/addCar', authentication, upload.fields([{name:'interior', maxCount:2}, {name:'exterior', maxCount:2}, {name:'thumbnailImg', maxCount:1}]), controller.createCars)
    router.patch('/editCar/', authentication, upload.fields([{name:'interior', maxCount:2}, {name:'exterior', maxCount:2}, {name:'thumbnailImg', maxCount:1}]), controller.editsCar)
    router.get('/carsDetails', authentication, controller.viewCar)
    router.delete('/deleteCar', authentication, controller.deletesCar)
    router.get('/getCars',authentication, controller.findsCar)
    router.get('/CarsFromRole', authentication, controller.findCarsBasedOnRole)
    router.patch('/partialUpdate', authentication, controller.carUpdateBasedOnRole)
    router.patch('/updateRating', authentication, controller.updateRating)
    router.get('/carPage', authentication, controller.carPaginations)

    return router
}