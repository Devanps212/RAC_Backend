import expressAsyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { userRepository } from '../../frameworks/database/mongodb/repositories/userRepositoryMongo'
import { createUserInterface, userInterface } from '../../types/userInterface'
import { userModelType } from '../../frameworks/database/mongodb/models/userModel'
import { userDbInterface } from '../../app/repositories/userDbrepository'
import { InterfaceAuthService } from '../../app/services/authServiceInterface'
import { AuthService } from '../../frameworks/services/authServices'
import { signUp, loginUser, otpGenr, verifyOTP } from '../../app/use_case/auth/userAuth'
import {  } from '../../types/userInterface'

const authController = (
    authServiceImpl: AuthService,
    authServiceInterface: InterfaceAuthService, 
    userRepository: userDbInterface,
    userDbRepoImpl: userRepository,
    userModel: userModelType
)=>{
    const dbrepositoryUser = userRepository(userDbRepoImpl(userModel))
    const authService = authServiceInterface(authServiceImpl())

    const userSignup = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const user : createUserInterface = req?.body
            await signUp(user, dbrepositoryUser, authService)
            res.json({
                status:"success",
                message:"User signUp successful"
            })
        }
    )

    const userLogin = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const {email, password} : {email:string, password:string} = req.body
            const checkUser = await loginUser(email, password, dbrepositoryUser, authService)
            res.json({
                status:"success",
                message:"Login success",
                checkUser
            })
        }
    )
    
    const otpGenerate = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            console.log("reached authcontroller for oto verification")
            const {email, password} : {email :string, password : string} = req?.body
            console.log("email = ", email, "password = ", password)
            const user = await loginUser(email, password, dbrepositoryUser, authService)
            const userId = user._id
            console.log("user exist = ",userId)
            const sendOtp = await otpGenr(email, dbrepositoryUser)
            //start from here 

            
            res.json({
                status:"success",
                message:"otp genrated success",
                
            })
        }
    )

    const otpVerify = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            console.log("reached verifyOtp")
            const {otp, userData, sample} =  req?.body
            const email = userData.email
            const password = userData.password
            console.log("OTP : ",otp, sample)
            console.log("EMAIL & Password, otp : ",email, password, sample)
            const OTPver = await  verifyOTP(otp, email, dbrepositoryUser, sample)
            console.log("OTPver = ",OTPver)
            const checkUser = await loginUser(email, password, dbrepositoryUser, authService)
            const payload = checkUser._id ? checkUser._id.toString() :''
            console.log("payload : ",payload)
            const token = await authService.jwtGeneration(payload, 'user')
            console.log("token : ",token)
            res.json({
                status:'success',
                message:'Verification completed',
                OTPver,
                token
            })
        }
    )
    
    return {userSignup, userLogin, otpGenerate, otpVerify}
}

export default authController