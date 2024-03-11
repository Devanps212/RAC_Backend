import express from 'express'
import { partnersModel } from '../../../database/mongodb/models/partnerModel'
import { partnerRepoInterface } from '../../../../app/repositories/partnerRepoInterface'
import { partnerDbRepo } from '../../../database/mongodb/repositories/partnerRepository'
import { authService } from '../../../services/authServices'
import { interfaceAuthService } from '../../../../app/services/authServiceInterface'
import partnerController from '../../../../adapter/controllers/partnerController'


const partnerRoute = ()=>{

    const controller = partnerController(partnersModel, partnerDbRepo, partnerRepoInterface, authService, interfaceAuthService)
    const router = express.Router()

    router.post('/login', controller.partnersLogin)

    return router
}

export default partnerRoute