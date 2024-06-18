import { Request, Response } from "express";
import { conversationInterfaceType } from "../../app/repositories/conversationInterface";
import { conversationRepositoryType } from "../../frameworks/database/mongodb/repositories/conversationRepository";
import { conversationModelType } from "../../frameworks/database/mongodb/models/conversationModel";
import expressAsyncHandler from "express-async-handler";
import { addMessage, findMessage, sendMessage } from "../../app/use_case/message/conversation";
import { messageInterface } from "../../types/messageModelInterfaces";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";
import { AuthService } from "../../frameworks/services/authServices";
import { messageRepositoryType } from "../../frameworks/database/mongodb/repositories/messageRepository";
import { MessageModelType } from "../../frameworks/database/mongodb/models/messageModel";
import { messageDbInterfaceType } from "../../app/repositories/messanger";
import { createNewMessage } from "../../app/use_case/message/message";

export const conversationController = (
    conversationInterface: conversationInterfaceType,
    conversationRepository: conversationRepositoryType,
    conversationModel: conversationModelType,
    authInterface: InterfaceAuthService,
    authRepository: AuthService,
    messageInterface: messageDbInterfaceType,
    messageRepository : messageRepositoryType,
    messageModel: MessageModelType
) =>{

  const conversationService = conversationInterface(conversationRepository(conversationModel))
  const messageServices = messageInterface(messageRepository(messageModel))
  const authService = authInterface(authRepository())
  
  const sendMessages = expressAsyncHandler(
    async (req: Request, res: Response) => {
      try {
        // console.log("found controller");
        // console.log("req.jwt : ", req.body.message);
        
        const { Id } = req.params;
        const { message, senderId } = req.body;

        // console.log("params received from send Message", Id);
          
        const data: Partial<messageInterface> = {
          message: message,
          senderId: senderId,
          recieverId: Id
        };
        
        
        const saveConversation = await sendMessage(data, conversationService, authService);
        const newMessage = await createNewMessage(data, messageServices);
        // console.log("newMessage : ", newMessage)
        // console.log("newMessage id : ", newMessage._id)
        const addMessageToConversation = await addMessage(newMessage._id as string, saveConversation._id as string, conversationService);

        res.json(newMessage);
      } catch (error: any) {
        console.error("Error in sendMessages:", error);
      }
    }
  );

  const getMessage = expressAsyncHandler(
    async(req: Request, res: Response)=>{
      
      const {userToChat} =req.params
      const { recieverId } = req.body
      console.log(recieverId)
      console.log(userToChat)
      const getMessage = await findMessage(userToChat, recieverId, conversationService)
      res.json(
        getMessage
      )
    }
  )

  return{
    sendMessages,
    getMessage
  }
}
    
    export default conversationController;