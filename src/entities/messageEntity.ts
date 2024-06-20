import { messageInterface } from "../types/messageModelInterfaces";
import { MessageModelType } from "../frameworks/database/mongodb/models/messageModel";
import AppError from "../utils/appErrors";
import { HttpStatus } from "../types/httpTypes";


export class MessagesEntity {
  private model: MessageModelType;

  constructor(model: MessageModelType) {
    this.model = model;
  }

  public async createMessage(message : messageInterface) : Promise<messageInterface>{
    try{

      console.log("receiever id  : ", message.recieverId)


      console.log(message)
      const createMessage = await this.model.create({
        message: message.message,
        recieverId: message.recieverId,
        senderId: message.senderId
      })
      
      if(message.recieverId){
        console.log("going to listen to the message")
        
      } else {
        console.log("no receiever id found")
      }

      if(!createMessage){
        throw new AppError('message creation failed', HttpStatus.EXPECTATION_FAILED)
      }
      return createMessage.toObject()
    }catch(error: any){
      throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


