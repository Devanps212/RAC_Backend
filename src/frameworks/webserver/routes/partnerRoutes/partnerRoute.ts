import express from 'express'
import { partnersModel } from '../../../database/mongodb/models/partnerModel'
import { partnerRepoInterface } from '../../../../app/repositories/partnerRepoInterface'
import { partnerDbRepo } from '../../../database/mongodb/repositories/partnerRepository'
import { authService } from '../../../services/authServices'
import { interfaceAuthService } from '../../../../app/services/authServiceInterface'
import partnerController from '../../../../adapter/controllers/partnerController'
import { paymentService } from '../../../services/paymentService'
import { paymentInterface } from '../../../../app/services/paymentInterface'
import { userdbRepository } from '../../../../app/repositories/userDbrepository'
import { userRepository } from '../../../database/mongodb/repositories/userRepositoryMongo'
import { usersModel } from '../../../database/mongodb/models/userModel'


const partnerRoute = ()=>{

    const controller = partnerController(partnerDbRepo, partnerRepoInterface, authService, interfaceAuthService, paymentInterface, paymentService, userdbRepository, userRepository, usersModel)
    const router = express.Router()

    router.post('/login', controller.partnersLogin)
    router.get('/signUp', controller.signUpPartner)
    router.get('/redirect-to/:transactionId/:userId', controller.transactionHandler)
    router.get('/All', controller.partnerFindAll)
    router.get('/findOne', controller.findOnePartner)
    

    return router
}

export default partnerRoute