import express from 'express'
import couponController from '../../../adapter/controllers/couponController'
import couponInterface from '../../../app/repositories/couponInterface'
import { couponRepository } from '../../database/mongodb/repositories/couponRepository'
import { couponModel } from '../../database/mongodb/models/couponModel'
import { userdbRepository } from '../../../app/repositories/userDbrepository'
import { userRepository } from '../../database/mongodb/repositories/userRepositoryMongo'
import { usersModel } from '../../database/mongodb/models/userModel'
import routes from './routes'

export const couponRoute = ()=>{
    const route = express.Router()
    const controller = couponController(
        couponInterface, 
        couponRepository, 
        couponModel,
        userdbRepository,
        userRepository,
        usersModel
    ) 

    route.post('/Generate', controller.generateCoupon)
    route.get('/findAll', controller.findAllCoupons)
    route.patch('/updateCoupon', controller.updateCoupons)
    route.post('/applyCoupon', controller.couponApply)
    // route.get('/userCoupon', controller.findUserCoupon)

    return route
}