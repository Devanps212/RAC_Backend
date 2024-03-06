import express from 'express'
import { carController } from '../../../adapter/controllers/carController'
import { carRepository } from '../../database/mongodb/repositories/carRepository'
import { carRepoInterface } from '../../../app/repositories/carRepoInterface'
import { carModel } from '../../database/mongodb/models/carModel'


export const carRoute = ()=>{
    const controller = carController(carRepoInterface, carRepository, carModel) 
    const router = express.Router()

    router.post('/addCar', controller.createCars)
    router.patch('/editCar', controller.editsCar)
    router.get('/carsDetails', controller.viewCar)
    router.delete('/deleteCar', controller.deletesCar)
    router.get('/getCars', controller.findsCar)

    return router
}