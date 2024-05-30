import { conversationModelType } from "../frameworks/database/mongodb/models/conversationModel";
import { HttpStatus } from "../types/httpTypes";
import { conversationInterface, messageInterface } from "../types/messageModelInterfaces";
import AppError from "../utils/appErrors";


export class conversationEntity{
    private model : conversationModelType

    constructor(model: conversationModelType){
        this.model = model
    }

    public async createConversation(data: messageInterface) : Promise<conversationInterface>{
        try{

            let conversation = await this.model.findOne({participants: {$all: [data.senderId, data.recieverId]}})

            if(!conversation){
                conversation = await this.model.create({participants: [ data.senderId, data.recieverId]})
                console.log(conversation)
            }
            return conversation.toObject()
        } catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async MessageAdd(messageId: string, conversationId: string): Promise<conversationInterface>{
        try{
          const edit = await this.model.findOneAndUpdate({_id: conversationId}, {$push:{messages:messageId}}, { new: true, useFindAndModify: false })
          if(!edit){
            throw new AppError("can't save message", HttpStatus.NOT_MODIFIED)
          }
          
          return edit.toObject()
        } catch(error: any){
          throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }


      public async getMessage(oppositeUserId: string, senderId:string):Promise<messageInterface>{
        try{
          const findMessage = await this.model.findOne({participants:{$all:[oppositeUserId, senderId]}}).populate('messages')
          if(!findMessage){
            throw new AppError('no conversation found', HttpStatus.NOT_FOUND)
          }
          const messages = findMessage.messages
          return messages.toObject()
        } catch(error: any){
          throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
}