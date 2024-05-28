import { conversationModelType } from "../models/conversationModel";
import { conversationEntity } from "../../../../entities/conversation";
import { messageInterface } from "../../../../types/messageModelInterfaces";


export const conversationRepository = (model: conversationModelType)=>{
    const chatEntity = new conversationEntity(model)

    const setParticipants = async(data: messageInterface)=>{
        const response = await chatEntity.createConversation(data)
        return response
    }

    const saveMessage = async(messageId: string, conversationId: string)=>{
        const response = await chatEntity.MessageAdd(messageId, conversationId)
        return response
    }

    const findMessage = async(oppositeUserId: string, senderId: string)=>{
        const response = await chatEntity.getMessage(oppositeUserId, senderId)
        return response
    }

    return{
        setParticipants,
        saveMessage,
        findMessage
    }
}

export type conversationRepositoryType = typeof conversationRepository