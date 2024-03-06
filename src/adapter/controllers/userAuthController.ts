import expressAsyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { userRepository } from '../../frameworks/database/mongodb/repositories/userRepositoryMongo'
import { createUserInterface, userInterface } from '../../types/userInterface'
import { userModelType } from '../../frameworks/database/mongodb/models/userModel'
import { userDbInterface } from '../../app/repositories/userDbrepository'
import { InterfaceAuthService } from '../../app/services/authServiceInterface'
import { AuthService } from '../../frameworks/services/authServices'
import { signUp, loginUser, otpGenr, verifyOTP, signIn_UpWithGoogle } from '../../app/use_case/auth/userAuth'
import { googleAuthServices } from '../../frameworks/services/googleAuthServices'
import { authGoogleInterface } from '../../app/services/googleAuthServicesInterface'

const authController = (
    authServiceImpl: AuthService,
    authServiceInterface: InterfaceAuthService, 
    userRepository: userDbInterface,
    userDbRepoImpl: userRepository,
    userModel: userModelType,
    googleServiceImpl: googleAuthServices,
    googleAuthInterface : authGoogleInterface
)=>{
    const dbrepositoryUser = userRepository(userDbRepoImpl(userModel))
    const authService = authServiceInterface(authServiceImpl())
    const googleAuthService = googleAuthInterface(googleServiceImpl())

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
            const payload = checkUser?._id ? checkUser._id.toString() :''
            console.log("payload : ",payload)
            const token = await authService.jwtGeneration(payload, 'user')
            console.log("token : ",token)
            res.json({
                status:"success",
                message:"Login success",
                token
            })
        }
    )
    
    const otpGenerate = expressAsyncHandler(async (req: Request, res: Response) => {
        console.log("Reached auth controller for OTP verification");
        const { email, password }: { email: string; password: string } = req?.body;
      
        try {
          if (email && password !== '') 
          {
            console.log("password found")
            console.log("Email = ", email, "Password = ", password);
      
            const user = await loginUser(email, password, dbrepositoryUser, authService);
            const userId = user._id;
            console.log("User exists = ", userId);
      
            const sendOtp = await otpGenr(email, dbrepositoryUser, 'signin');
            const OTP = sendOtp.otp;
      
            console.log("Secret: ", OTP);
      
            res.json({
              status: 'success',
              code: 200,
              message: 'OTP generated successfully',
              purpose: 'signin',
              userId,
              OTP,
            });
          } 
          else 
          {
            console.log("email from userSignup",email)
            const sendOtp = await otpGenr(email, dbrepositoryUser, 'signup');
            const OTP = sendOtp.otp;
            console.log("Secret: ", OTP);
      
            res.json({
              status: 'success',
              code: 200,
              message: 'OTP generated successfully',
              purpose: 'signup',
              OTP,
            });
          }
        } catch (error:any) {
          console.error("Error in OTP generation:", error.message,"statusCode :", error.statusCode);
          let statusCode = 500
          let message = 'Internal Server Error'

          if(error.isOperational && error.statusCode)
          {
            console.log("error is optional")
            statusCode  = error.statusCode
            message = error.message
          }

          res.status(statusCode).json({
            status: 'error',
            code: statusCode,
            message: message,
          });
        }
      });
      
      const signInUpWithGoogle = expressAsyncHandler(
        async(req:Request, res:Response)=>{
          console.log("reached google verification")
          const {credentials} : {credentials : string} = req.body
          const signUpInGoogle = await signIn_UpWithGoogle(credentials, googleAuthService, dbrepositoryUser, authService)
          if(signUpInGoogle.purpose == "sigIn")
          {
            res.json({
              status:"success",
              message: signUpInGoogle.message,
              token :signUpInGoogle.token,
            })
          }
          else
          {
            res.json({
              status:"success",
              message: signUpInGoogle.message,
              token :signUpInGoogle.token,
            })
          }
        }
      )
    
    return {userSignup, userLogin, otpGenerate, signInUpWithGoogle}
}

export default authController