import { messageInterface } from "../../../types/messageModelInterfaces";
import { HttpStatus } from "../../../types/httpTypes";
import AppError from "../../../utils/appErrors";
import { conversationInterfaceType, conversationInterfaces } from "../../repositories/conversationInterface";
import { InterfaceAuthService } from "../../services/authServiceInterface";
import { sessionInterface } from "../../../types/userInterface";


export const sendMessage = async(data: messageInterface, conversationInterface : ReturnType<conversationInterfaceType>, authInterface : ReturnType<InterfaceAuthService>)=>{
    try{
        console.log("data :", data)
        if(!data.senderId){
            console.log(data)
            throw new AppError("token not found", HttpStatus.NOT_FOUND)
        }
        const response = await conversationInterface.setParticipants(data)
        return response

    }catch(error: any){
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const addMessage = async(messageId: string, conversationId: string, conversationInterface: ReturnType<conversationInterfaceType>)=>{
    const response = await conversationInterface.addMessage(messageId, conversationId)
    return response
}
export const findMessage = async(oppositeUserId: string, senderId: string, conversationInterface:ReturnType<conversationInterfaceType>)=>{
    const response = await conversationInterface.findMessage(oppositeUserId, senderId)
    return response
}