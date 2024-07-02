import { partnerModelType } from "../../frameworks/database/mongodb/models/partnerModel";
import { partnerRepoType } from "../../frameworks/database/mongodb/repositories/partnerRepository";
import { partnerInterfaceType } from "../../app/repositories/partnerRepoInterface";
import { Request, Response } from "express";
import configFile from "../../config";
import { findAllPartner, partnerLogin, partnerSignUp } from "../../app/use_case/auth/partnerUseCase";
import { AuthService } from "../../frameworks/services/authServices";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";
import expressAsyncHandler from "express-async-handler";
import { paymentInterfaceType } from "../../app/services/paymentInterface";
import { paymentServiceType } from "../../frameworks/services/paymentService";
import { partnerExist, signUpPayment } from "../../app/use_case/partner/partnerUseCase";
import { partnerData } from "../../types/partnerInterface";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { checkUserExists } from "../../app/use_case/auth/userAuth";
import { findUsersForConversation } from "../../app/use_case/user/user";
import AppError from "../../utils/appErrors";
import { HttpStatus } from "../../types/httpTypes";
import { getAllCateg } from "../../app/use_case/category/category";

const partnerController = (
    partnerRepository: partnerRepoType,
    partnerInterface : partnerInterfaceType,
    authService: AuthService,
    authServiceInterface: InterfaceAuthService,
    paymentInterface : paymentInterfaceType,
    paymentService : paymentServiceType,
    userInterface : userDbInterface,
    userDbrepository : userRepository,
    userModel: userModelType
)=>{

    const partnerService = partnerInterface(partnerRepository(userModel))
    const authServices = authServiceInterface(authService())
    const paymentServices = paymentInterface(paymentService())
    const userServices = userInterface(userDbrepository(userModel))

    const partnersLogin = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const {formData} = req?.body
            const {email, password} =formData
            if(email && password)
            {
                const partner = await partnerLogin(email, password, partnerService, authServices)
                
                const payload = partner?._id ? partner._id.toString() : ''
                
                const token = await authServices.jwtGeneration(payload, 'partner')
                
                res.json({
                    status:"success",
                    message:"successfully logged in",
                    token
                })
            }
            
        }
    )

    const signUpPartner = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const { partnerData }= req.body as { partnerData:partnerData }
           
            const payload = await authServices.tokenVerification(partnerData.token)
            let partnerId : string =''
            if(typeof payload ==='object' && 'payload' in payload)
            {
                partnerId = payload.payload
            }
            
            const userExists = await checkUserExists(partnerId, userServices)
            
            const partnerExists = await partnerExist(partnerId, partnerService)
            if(partnerExists === null && userExists)
            {
                partnerData.email = userExists.email
                partnerData.userId = userExists._id?.toString()
                const paymentStarts = await signUpPayment(partnerData, paymentServices)
                
                res.json({
                    data: paymentStarts,
                    message:"success",
                })   
            }
            else
            {
                
                res.json({
                    data:null,
                    message:"Partner already exist"
                })
            }
        }
    )

    const transactionHandler = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            const transactionId = req.params.transactionId
            const partnerId = req.params.userId
            
            const partner = await partnerSignUp(partnerId, transactionId, partnerService)
            
            console.log("domain : ", configFile.DOMAIN_URL)
            res.redirect(`https://easyrentacar.shop/partner/success/${transactionId}/${partnerId}`)
        }
    )

    const partnerFindAll = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const partners = await findAllPartner(partnerService)
            res.json({
                data: partners,
                status: 'success'
            })
        }
    )

    const findOnePartner = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            const {id} = req.query
            const partnerId = id as string
            
            
            const findPartner = await partnerExist(partnerId, partnerService)
            if(!findPartner){
                throw new AppError('no partner found', HttpStatus.NO_CONTENT)
            }
            res.json(findPartner)
        }
    )

    const findUsersConversation = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          
          const userId = req.query.userId
          
          const findUsers = await findUsersForConversation(String(userId), userServices)
          res.json({
            data: findUsers,
            status: 'success'
          })
        }
      )

    return {
        partnersLogin, 
        signUpPartner, 
        transactionHandler, 
        partnerFindAll, 
        findOnePartner,
        findUsersConversation
    }
    
}

export default partnerController