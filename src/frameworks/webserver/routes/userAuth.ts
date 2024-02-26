import express, { Router } from 'express'
import authController from '../../../adapter/controllers/userAuthController'
import {userdbRepository} from '../../../app/repositories/userDbrepository'
import { userRepository } from '../../database/mongodb/repositories/userRepositoryMongo'
import { usersModel } from '../../database/mongodb/models/userModel'
import { authService } from '../../services/authServices'
import { interfaceAuthService } from '../../../app/services/authServiceInterface'
import configFile from '../../../config'

const userAuthentication = ()=>{
    const route = express.Router()

    const controller = authController(authService, interfaceAuthService, userdbRepository, userRepository, usersModel)

    route.post('/signup', controller.userSignup)
    route.post('/login', controller.userLogin)
    route.post('/VOTP', controller.otpGenerate)
    route.post('/VerifyOTP',controller.otpVerify)

    return route
}

export default userAuthentication