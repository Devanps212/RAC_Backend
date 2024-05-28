// import express from 'express'
// import { messageDbInterface } from '../../../app/repositories/messanger'
// import { messageRepository } from '../../database/mongodb/repositories/messageRepository'
// import { MessageModel } from '../../database/mongodb/models/messageModel'
// import messageController from '../../../adapter/controllers/messengerControll'

// const messageRoute = ()=>{
//     const router = express.Router()

//     const controller = messageController(messageDbInterface, messageRepository, MessageModel)

//     router.post('/', controller.saveMessage)
//     router.get('/:conId', controller.getConversationMessages)

//     return router
// }

// export default messageRoute
