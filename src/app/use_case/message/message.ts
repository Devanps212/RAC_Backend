import { messageInterface } from "../../../types/messageModelInterfaces";
import { messageDbInterfaceType } from "../../repositories/messanger";

export const createNewMessage = async(data: messageInterface, messageInterface:ReturnType<messageDbInterfaceType>)=>{
    const response = await messageInterface.createMessage(data)
    return response
}