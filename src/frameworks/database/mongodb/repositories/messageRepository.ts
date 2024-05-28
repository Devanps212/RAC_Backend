import { messageInterface } from "../../../../types/messageModelInterfaces";
import { MessageModelType } from "../models/messageModel";
import { MessagesEntity } from "../../../../entities/messageEntity";

export const messageRepository = (model: MessageModelType) => {
    const messageEntity = new MessagesEntity(model);

    const createMessage = async(data: messageInterface)=>{
        const response = await messageEntity.createMessage(data)
        return response
    }
    return{
        createMessage
    }
}

export type messageRepositoryType = typeof messageRepository;