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