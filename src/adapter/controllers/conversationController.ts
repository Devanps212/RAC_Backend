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
        
        const { Id } = req.params;
        const { message, senderId } = req.body;

          
        const data: Partial<messageInterface> = {
          message: message,
          senderId: senderId,
          recieverId: Id
        };
        
        
        const saveConversation = await sendMessage(data, conversationService, authService);
        const newMessage = await createNewMessage(data, messageServices);
        
        const addMessageToConversation = await addMessage(newMessage._id as string, saveConversation._id as string, conversationService);

        res.json(newMessage);
      } catch (error: any) {
        console.error("Error in sendMessages:", error);
      }
    }
  );

  const getMessage = expressAsyncHandler(
    async(req: Request, res: Response)=>{
      
      const { receiverId, senderId } =req.params
      
      const getMessage = await findMessage(receiverId, senderId, conversationService)
      
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