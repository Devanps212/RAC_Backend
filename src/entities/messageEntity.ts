import { messageInterface } from "../types/messageModelInterfaces";
import { MessageModelType } from "../frameworks/database/mongodb/models/messageModel";
import AppError from "../utils/appErrors";
import { HttpStatus } from "../types/httpTypes";
import { getRecieverSocketId } from "../frameworks/websocket/socket";
import { io } from "..";


export class MessagesEntity {
  private model: MessageModelType;

  constructor(model: MessageModelType) {
    this.model = model;
  }

  public async createMessage(message : messageInterface) : Promise<messageInterface>{
    try{

      const recieverSocketId = getRecieverSocketId(message.recieverId as string)


      console.log(message)
      const createMessage = await this.model.create({
        message: message.message,
        recieverId: message.recieverId,
        senderId: message.senderId
      })
      
      if(message.recieverId){
        console.log("going to listen to the message")
        io.to(recieverSocketId).emit("newMessage", message.message)
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


