import AppError from "../../../utils/appErrors"
import { HttpStatus } from "../../../types/httpTypes"
import configFile from "../../../config"
import axios from "axios"
import { userInterface } from "../../../types/userInterface"
import { userDbInterface } from "../../repositories/userDbrepository"
import { App } from "react-bootstrap-icons"
import { InterfaceAuthService } from "../../services/authServiceInterface"
import { Types } from "mongoose"

export const locationFinder = async(data: string)=>{
    try
    {
        console.log("Data ===>",data)
        console.log(process.env.LOCATION_SEARCH_API)
        const response = await axios.get(`${configFile.SEARCH_LOCATION}suggest?q=${data}&access_token=${configFile.LOCATION_ACCESS_TOKEN}&session_token=ce8adf6d-f635-415e-ad83-7597a752bdfc&language=en&limit=10&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi%2Cstreet%2Ccategory&proximity=76.3218144%2C9.9380786`)
        return response.data.suggestions
    }
    catch(error:any)
    {
        console.log(error)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const updateUser = async(data: Partial<userInterface>, userInterface: ReturnType<userDbInterface>)=>{
    const response = await userInterface.userUpdate(data)
    return response
}

export const findUsersForConversation = async(id: string, userInterface: ReturnType<userDbInterface>)=>{
    const response = await userInterface.findUsersForConversation(id)
    return response
}
export const passwordReset = async(password: string, userId: string, authInterface: ReturnType<InterfaceAuthService>, userInterface: ReturnType<userDbInterface>)=>{
    try{
        const hashPassword = await authInterface.encryptPassword(password)
        if(!hashPassword){
            throw new AppError('password checking bcryption failed Please try again', HttpStatus.NOT_IMPLEMENTED)
        }
        const data : userInterface = {
            _id: new Types.ObjectId(userId),
            password: hashPassword
        }

        const updateUser = await userInterface.userUpdate(data)
        
        return updateUser

    } catch(error: any){
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}