import express from 'express'
import { conversationInterfaces } from '../../../app/repositories/conversationInterface'
import { conversationRepository } from '../../database/mongodb/repositories/conversationRepository'
import { conversationModel } from '../../database/mongodb/models/conversationModel'
import conversationController from '../../../adapter/controllers/conversationController'
import { interfaceAuthService } from '../../../app/services/authServiceInterface'
import { authService } from '../../services/authServices'
import { messageDbInterface } from '../../../app/repositories/messanger'
import { messageRepository } from '../../database/mongodb/repositories/messageRepository'
import { MessageModel } from '../../database/mongodb/models/messageModel'
import { PartnerUserAuthentication } from '../middlewares/partnerUserProtectMiddleware'

const conversationRoute = ()=>{
    
    const router = express.Router()

    const controller = conversationController(
        conversationInterfaces, 
        conversationRepository, 
        conversationModel, 
        interfaceAuthService, 
        authService,
        messageDbInterface,
        messageRepository,
        MessageModel
    )
    
    router.post('/send/:Id', PartnerUserAuthentication, controller.sendMessages)
    router.get('/:receiverId/:senderId', PartnerUserAuthentication, controller.getMessage)

    return router
}

export default conversationRoute