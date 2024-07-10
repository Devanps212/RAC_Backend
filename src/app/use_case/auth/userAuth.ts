import { userDbInterface } from "../../repositories/userDbrepository";
import { createUserInterface, userInterface } from "../../../types/userInterface";
import { InterfaceAuthService } from "../../services/authServiceInterface";
import { HttpStatus } from "../../../types/httpTypes";
import AppError from "../../../utils/appErrors";
import { otpAuth } from "../../../frameworks/services/otpServices";
import { GeneratedSecret } from "speakeasy";
import { authGoogleInterface } from "../../services/googleAuthServicesInterface";


export const signUp = async(user:createUserInterface, userRepository : ReturnType<userDbInterface>, authService: ReturnType<InterfaceAuthService>)=>
{
    user.email = user.email.toLowerCase()
    console.log("User email : ", user.email)
    const existingUser = await userRepository.getUserByEmail(user.email)
    if(existingUser)
    {
        console.log("email already exist")
        throw new AppError("Email already exists", HttpStatus.CONFLICT)
    }
    user.password = await authService.encryptPassword(user.password ?? "")
    const result = await userRepository.createUser(user)
    return result
}

export const loginUser = async(email:string, password:string, userRepository: ReturnType<userDbInterface>, authService: ReturnType<InterfaceAuthService>)=>{
    const user = await userRepository.getUserByEmail(email)
    
    console.log("user auth  :", user?.isGoogleUser)

    if(!user)
    {
        console.log("not found")
        throw new AppError("User not found", HttpStatus.UNAUTHORIZED)
    }
    if(!user.isActive)
    {
        console.log("blocked")
        throw new AppError(`${user.name} is blocked`, HttpStatus.UNAUTHORIZED)
    }

    if (user.isGoogleUser) 
    {
        console.log("google user")
        throw new AppError("this user is unauthorized", HttpStatus.UNAUTHORIZED);
    }
    console.log("email ok")

    const passCheck = await authService.decryptPassword(password, user.password ?? "")

    if(!passCheck)
    {
        throw new AppError("Password is wrong", HttpStatus.UNAUTHORIZED)
    }
    console.log(user)
    return user
    
}

export const otpGenr = async(email:string, userRepInterface: ReturnType<userDbInterface>, purpose : 'signup' | 'signin' | 'FPOTP')=>{
    try{

        const { sendOtp } = otpAuth();
        if(purpose == 'signin'){
            
            const checksUser = await userRepInterface.getUserByEmail(email)
            if(!checksUser)
            {
                throw new AppError("User not found", HttpStatus.UNAUTHORIZED)
            }
            const sendOTP = await sendOtp(email)
            
            return sendOTP
        }
        else if(purpose =='signup'){
            
            const checksUser = await userRepInterface.getUserByEmail(email)
            if(checksUser)
            {
                throw new AppError("Email already used", HttpStatus.UNAUTHORIZED)
            }
            const sendOTP = await sendOtp(email)

            return sendOTP
        } else {
            const checksUser = await userRepInterface.getUserByEmail(email)
            if(checksUser?.isGoogleUser){
                throw new AppError('Google authenticated users cannot change their password.', HttpStatus.NOT_ACCEPTABLE);
            }
            const OTP = await sendOtp(email)
            return OTP
        }
        
    }
    catch(error:any)
    {
        console.log("error message :",error)
        throw new AppError(error.message, HttpStatus.BAD_REQUEST)
        
    }
}

export const verifyOTP = async(otp:string, secret : GeneratedSecret | undefined)=>{
    try{
        console.log("userAuth verifyOTP reached")
        if(secret)
        {
            console.log("user found")
            const {verifyOtp} = otpAuth()
            const check = verifyOtp(otp, secret)
            console.log("currentOtp :", check)
            return check
        }
        else
        {
            console.log("error no secret found")
            throw new AppError("OTP error", HttpStatus.BAD_GATEWAY)
        }
    }
    catch(error:any)
    {
        throw new Error("Internal server error")
    }
}

export const signIn_UpWithGoogle = async(
    credentials : string,
    googleAuthInterface : ReturnType<authGoogleInterface>,
    userRepositoryInterface : ReturnType<userDbInterface>,
    authService : ReturnType<InterfaceAuthService>
)=>{
    try
    {
        console.log("reached signin/signUp Google")
        const user = await googleAuthInterface.verify(credentials)
        console.log("user : ", user)
        const userExist = await userRepositoryInterface.getUserByEmail(user.email)
        if(userExist)
        {
            if(userExist.isActive)
            {
                console.log("UserSignIn starting")
                const payload = userExist?._id?.toString()
                console.log("payload for G signin : ", payload)
                const token = await authService.jwtGeneration(payload ?? '', 'user')
                console.log("new Token  :", token)
                return {purpose:"sigIn", message: "user SignIn success", token}
            }
            else
            {
                throw new AppError(`User ${userExist.name} is blocked`, HttpStatus.UNAUTHORIZED)
            }
            
        }
        else
        {
            console.log('user sigUp starting')
            const User = await userRepositoryInterface.createUser(user)
            console.log("new user created")
            const payload = User?._id?.toString()
            console.log("payload : ", payload)
            const token = await authService.jwtGeneration(payload ?? '' , 'user')
            return {purpose:"sigIn", message: "user SignUp success", token}
            
        }
    }
    catch(error:any)
    {
        throw new AppError(error.message, HttpStatus.BAD_REQUEST)
    }
}

export const checkUserExists = async(userId : string, userRepository : ReturnType<userDbInterface>)=>{
    try
    {
        const response = await userRepository.findOneUser(userId)
        return response
    }
    catch(error:any)
    {
        console.log(error.message)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

export const findUser = async(userId : string, userRepository : ReturnType<userDbInterface>)=>{
    try
    {
        const response = await userRepository.findUser(userId)
        return response
    }
    catch(error:any)
    {
        console.log(error.message)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}

export const AllMongoUsers = async(userRepository : ReturnType<userDbInterface>)=>{
    const response = await userRepository.findMongoAllUsers()
    return response
}

export const checkUserByEmail = async(email: string, userRepository : ReturnType<userDbInterface>)=>{
    const response = await userRepository.getUserByEmail(email)
    return response
}

