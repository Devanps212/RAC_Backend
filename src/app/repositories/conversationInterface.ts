import { conversationRepositoryType } from "../../frameworks/database/mongodb/repositories/conversationRepository";
import { conversationInterface, messageInterface } from "../../types/messageModelInterfaces";

export const conversationInterfaces = (conversationRepository: ReturnType<conversationRepositoryType>)=>{
    const setParticipants = async(data: messageInterface)=>{
        const response = await conversationRepository.setParticipants(data)
        return response
    }

    const addMessage = async(messageId : string, conversationId: string)=>{
        const response = await conversationRepository.saveMessage(messageId, conversationId)
        return response
    }

    const findMessage = async(oppositeUserId: string, senderId: string)=>{
        const response = await conversationRepository.findMessage(oppositeUserId, senderId)
        return response
    }

    return {
        setParticipants, 
        addMessage, 
        findMessage   
    }
}

export type conversationInterfaceType = typeof conversationInterfaces

