import expressAsyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { userRepository } from '../../frameworks/database/mongodb/repositories/userRepositoryMongo'
import { createUserInterface, userInterface } from '../../types/userInterface'
import { userModelType } from '../../frameworks/database/mongodb/models/userModel'
import { userDbInterface } from '../../app/repositories/userDbrepository'
import { InterfaceAuthService } from '../../app/services/authServiceInterface'
import { AuthService } from '../../frameworks/services/authServices'
import { signUp, loginUser, otpGenr, verifyOTP, signIn_UpWithGoogle, findUser, AllMongoUsers, checkUserByEmail } from '../../app/use_case/auth/userAuth'
import { googleAuthServices } from '../../frameworks/services/googleAuthServices'
import { authGoogleInterface } from '../../app/services/googleAuthServicesInterface'
import { locationFinder, passwordReset, updateUser } from '../../app/use_case/user/user'
import AppError from '../../utils/appErrors'
import { HttpStatus } from '../../types/httpTypes'


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
            const DBuser = await signUp(user, dbrepositoryUser, authService)
            const userId = DBuser?._id?.toString() || '';
            const jwtGeneration = await authService.jwtGeneration(userId, 'user');

            res.json({
                status:"success",
                message:"User signUp successful",
                token: jwtGeneration
            })
        }
    )

    const userLogin = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const {email, password} : {email:string, password:string} = req.body
            
            const checkUser = await loginUser(email, password, dbrepositoryUser, authService)
            const payload = checkUser?._id ? checkUser._id.toString() :''
            
            const token = await authService.jwtGeneration(payload, 'user')
            
            res.json({
                status:"success",
                message:"Login success",
                token
            })
        }
    )
    
    const otpGenerate = expressAsyncHandler(async (req: Request, res: Response) => {
        
        const { email, password, purpose }: { email: string; password: string, purpose: string } = req?.body;
      
        console.log("checking user is google authenticated")
        try {
          if (email && password !== '') 
          {
            console.log("checking")
            const user = await loginUser(email, password, dbrepositoryUser, authService);
            const userId = user._id;
            console.log(user.isGoogleUser)

            console.log("user is not google user")
      
            const sendOtp = await otpGenr(email, dbrepositoryUser, 'signin');
            const OTP = sendOtp.otp;
      
            res.json({
              status: 'success',
              code: 200,
              message: 'OTP generated successfully',
              purpose: 'signin',
              userId,
              OTP,
            });
          } 
          else if(email && password && purpose === '') 
          {
            
            const sendOtp = await otpGenr(email, dbrepositoryUser, 'signup');
            const OTP = sendOtp.otp;
      
            res.json({
              status: 'success',
              code: 200,
              message: 'OTP generated successfully',
              purpose: 'signup',
              OTP,
            });
          } else {
              const user = await checkUserByEmail(email, dbrepositoryUser)
              const sendOtp = await otpGenr(email, dbrepositoryUser, 'FPOTP');
              const OTP = sendOtp.otp;
              
              res.json({
                status: 'success',
                code: 200,
                message: 'OTP generated successfully',
                purpose: 'signup',
                OTP,
                user
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

      const locationFinders = expressAsyncHandler(
        async(req:Request, res:Response)=>{
          
          const locations = req.body.location
          
          const location = await locationFinder(locations)
          res.json({
            data:location
          })
          
        }
      )

      const findSingleUser = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          const { data }  = req.query as { data : string}
          const findOneUser = await findUser(data, dbrepositoryUser)
          res.json({
            status: 'success',
            data: findOneUser
          })
        }
      )

      const upDateDetail = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          
          let data : Partial<userInterface>;
          if(req.files){
            
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const path = files.profilePic[0].path
            
            data = {}
            data.profilePic = path
            data._id = req.body._id

          } else {

            console.log(req.body)
            data = req.body;

          }
          
          const updatingUser = await updateUser(data, dbrepositoryUser)
          res.json({
            status: 'success',
            data: updatingUser
          })
        }
      )

      const MongoAllUsers = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          const users = await AllMongoUsers(dbrepositoryUser)
          
          res.json({
            data: users,
            status: 'success'
          })
        }
      )

      const findUserBasedOnEmail = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          const email = req.headers['x-user-email'] as string;
          const userExist = await checkUserByEmail(email, dbrepositoryUser)
          
          res.json({
            user: userExist,
            status:'success'
          })
        }
      )

      const resetPassword = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          
          const { password, userId } = req.body
          
          const reset = await passwordReset(password, userId, authService, dbrepositoryUser)
          
          res.json({
            message:'success fully updated password',
            status:"success"
          })
        }
      )

      
    return { 
      userLogin,
      userSignup, 
      otpGenerate,
      upDateDetail,
      MongoAllUsers,
      resetPassword,
      findSingleUser,
      locationFinders,
      signInUpWithGoogle,
      findUserBasedOnEmail,
      }
}


export default authController