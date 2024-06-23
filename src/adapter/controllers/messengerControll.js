"use strict";
// import { Request, Response } from "express";
// import { messageDbInterfaceType } from "../../app/repositories/messanger";
// import { messageRepositoryType } from "../../frameworks/database/mongodb/repositories/messageRepository";
// import { MessageModelType } from "../../frameworks/database/mongodb/models/messageModel";
// import expressAsyncHandler from "express-async-handler";
// import { newMessage, getMessages } from "../../app/use_case/message/message";
// export const messageController = (
//     messageInterface: messageDbInterfaceType,
//     messageDbRepository: messageRepositoryType,
//     messageModel: MessageModelType
// ) => {
//     const messageService = messageInterface(messageDbRepository(messageModel));
//     const saveMessage = expressAsyncHandler(
//         async (req: Request, res: Response) => {
//             const message = req?.body ?? {};
//             const messages = await newMessage(message, messageService);
//             res.json(messages);
//         }
//     )
//     const getConversationMessages = expressAsyncHandler(
//         async (req: Request, res: Response) => {
//             const conversationId = req?.params?.conId ?? ''
//             if (!conversationId) {
//                 throw new Error('No conversation id found');
//             }
//             const messages = await getMessages(conversationId, messageService);
//             res.json(messages);
//         }
//     )
//     return {
//         saveMessage,
//         getConversationMessages
//     }
// }
// export default messageController
