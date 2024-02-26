import { userDbInterface } from "../../repositories/userDbrepository";
import { createUserInterface } from "../../../types/userInterface";
import { InterfaceAuthService } from "../../services/authServiceInterface";
import { HttpStatus } from "../../../types/httpTypes";
import AppError from "../../../utils/appErrors";
import { otpAuth } from "../../../frameworks/services/otpServices";


export const signUp = async(user:createUserInterface, userRepository : ReturnType<userDbInterface>, authService: ReturnType<InterfaceAuthService>)=>
{
    user.email = user.email.toLowerCase()
    console.log("User email : ", user.email)
    const existingUser = await userRepository.getUserByEmail(user.email)
    if(existingUser)
    {
        throw new AppError("Email already exists", HttpStatus.CONFLICT)
    }
    user.password = await authService.encryptPassword(user.password ?? "")
    const result = await userRepository.createUser(user)
    return result
}

export const loginUser = async(email:string, password:string, userRepository: ReturnType<userDbInterface>, authService: ReturnType<InterfaceAuthService>)=>{
    const user = await userRepository.getUserByEmail(email)
    console.log("user password : ",user?.password, password)

    if(!user)
    {
        console.log("no user found")
        throw new AppError("User not found", HttpStatus.UNAUTHORIZED)
    }

    const passCheck = await authService.decryptPassword(password, user.password ?? "")
    console.log("passCheck : ", passCheck)

    if(!passCheck)
    {
        console.log("password error")
        throw new AppError("Password is wrong", HttpStatus.UNAUTHORIZED)
    }
    return user
    
}

export const otpGenr = async(email:string, userRepInterface: ReturnType<userDbInterface>)=>{
    try{

        console.log("reached usecase")
        const { sendOtp } = otpAuth();
        const checksUser = await userRepInterface.getUserByEmail(email)
        if(!checksUser)
        {
            throw new AppError("User not found", HttpStatus.UNAUTHORIZED)
        }
        else
        {
            const sendOTP = await sendOtp(email)
            console.log("send : ", sendOTP)
            return sendOTP
        }
        
    }
    catch(error:any)
    {
        console.log("error message :",error.message)
        throw new AppError(error.message, HttpStatus.BAD_REQUEST)
        
    }
}

export const verifyOTP = async(otp:string, email:string, userRepInterface: ReturnType<userDbInterface>, verotp:string)=>{
    try{
        console.log("userAuth verifyOTP reached")
        const user = await userRepInterface.getUserByEmail(email)
        console.log("user =", user)
        if(user)
        {
            console.log("user found")
            const {verifyOtp} = otpAuth()
            const check = verifyOtp(otp, verotp)
            console.log("currentOtp :", check)
            return check
        }
    }
    catch(error:any)
    {
        throw new Error("Internal server error")
    }
}
