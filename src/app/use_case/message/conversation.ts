import { messageInterface } from "../../../types/messageModelInterfaces";
import { HttpStatus } from "../../../types/httpTypes";
import AppError from "../../../utils/appErrors";
import { conversationInterfaceType, conversationInterfaces } from "../../repositories/conversationInterface";
import { InterfaceAuthService } from "../../services/authServiceInterface";
import { sessionInterface } from "../../../types/userInterface";


export const sendMessage = async(data: messageInterface, conversationInterface : ReturnType<conversationInterfaceType>, authInterface : ReturnType<InterfaceAuthService>)=>{
    try{
        if(!data.senderId){
            throw new AppError("token not found", HttpStatus.NOT_FOUND)
        }
        console.log("verifying token")
        const verifyToken = await authInterface.tokenVerification(data.senderId as string)
        console.log("token verified : ", verifyToken)

        if(!verifyToken){
            throw new AppError("User is unAuthorized", HttpStatus.NOT_FOUND)
        }
        if(typeof verifyToken === 'object' && 'payload' in verifyToken){
            data.senderId = verifyToken.payload
        } else {
            throw new AppError("un Authorized user", HttpStatus.UNAUTHORIZED)
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