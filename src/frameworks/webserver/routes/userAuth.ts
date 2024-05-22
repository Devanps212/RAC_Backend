import express, { Router } from 'express'
import authController from '../../../adapter/controllers/userAuthController'
import {userdbRepository} from '../../../app/repositories/userDbrepository'
import { userRepository } from '../../database/mongodb/repositories/userRepositoryMongo'
import { usersModel } from '../../database/mongodb/models/userModel'
import { authService } from '../../services/authServices'
import { interfaceAuthService } from '../../../app/services/authServiceInterface'
import { googleAuthInterface } from '../../../app/services/googleAuthServicesInterface'
import { googleAuthService } from '../../services/googleAuthServices'
import upload from '../../../app/services/multerService'

const userAuthentication: ()=>Router = ()=>{
    const route = express.Router()

    const controller = authController(authService, interfaceAuthService, userdbRepository, userRepository, usersModel, googleAuthService, googleAuthInterface)

    route.post('/signup', controller.userSignup)
    route.post('/login', controller.userLogin)
    route.post('/VOTP', controller.otpGenerate)
    route.post('/Google-SignIn-Up', controller.signInUpWithGoogle)
    route.post('/location', controller.locationFinders)
    route.get('/findUser', controller.findSingleUser)
    route.post('/saveUser', upload.fields([{name: 'profilePic', maxCount:1}]), controller.upDateDetail)
    route.get('/getAll', controller.MongoAllUsers)

    return route
}

export default userAuthentication