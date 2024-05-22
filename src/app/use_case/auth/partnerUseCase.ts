import { HttpStatus } from "../../../types/httpTypes";
import AppError from "../../../utils/appErrors";
import { partnerInterfaceType } from "../../repositories/partnerRepoInterface";
import { InterfaceAuthService } from "../../services/authServiceInterface";

export const partnerLogin = async(email: string, password: string, partnerInterface: ReturnType<partnerInterfaceType>, authService: ReturnType<InterfaceAuthService>)=>{
    const user = await partnerInterface.partnerLogin(email)
    if(user && user.password)
    {
        const checkPassword = await authService.decryptPassword(password, user.password)
        if(checkPassword)
        {
            return user
        }
        else
        {
            throw new AppError('Password error', HttpStatus.UNAUTHORIZED)
        }
    }
    return null
}

export const partnerSignUp = async (userId: string, transactionId: string, partnerInterface: ReturnType<partnerInterfaceType>)=>{
    const amount = 250;
    const purpose = 'signUp'
    const partner = await partnerInterface.partnerExist(userId)
    if(partner !== null)
    {
        console.log("partner exist : ", partner)
        throw new AppError('Partner is already exist', HttpStatus.CONFLICT)
    }

    console.log("creating signUp")
    const partnerSignUp = await partnerInterface.partnerSignup(userId, transactionId, purpose, amount)
    if(partnerSignUp === null)
    {
        console.log("Partner creation failed")
        throw new AppError("Partner creation failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return partnerSignUp
}

export const findAllPartner = async(partnerInterface: ReturnType<partnerInterfaceType>)=>{
    const response = await partnerInterface.findPartner()
    return response
}