import express from 'express'
import { carController } from '../../../adapter/controllers/carController'
import { carRepository } from '../../database/mongodb/repositories/carRepository'
import { carRepoInterface } from '../../../app/repositories/carRepoInterface'
import { carModel } from '../../database/mongodb/models/carModel'
import upload from '../../../app/services/multerService'
import { authentication } from '../middlewares/authenticationMidddleware'

export const carRoute = ()=>{
    const controller = carController(carRepoInterface, carRepository, carModel) 
    const router = express.Router()

    router.post('/addCar', authentication, upload.fields([{name:'interior', maxCount:2}, {name:'exterior', maxCount:2}]), controller.createCars)
    router.patch('/editCar', authentication, controller.editsCar)
    router.get('/carsDetails', authentication, controller.viewCar)
    router.delete('/deleteCar', authentication, controller.deletesCar)
    router.get('/getCars',authentication, controller.findsCar)

    return router
}