import { messageInterface } from "../../types/messageModelInterfaces";
import { messageRepositoryType } from "../../frameworks/database/mongodb/repositories/messageRepository";

export const messageDbInterface = (repository: ReturnType<messageRepositoryType>) => {
    const createMessage = async(data: messageInterface)=>{
        const response = await repository.createMessage(data)
        return response
    }

    return{
        createMessage
    }
}

export type messageDbInterfaceType = typeof messageDbInterface;