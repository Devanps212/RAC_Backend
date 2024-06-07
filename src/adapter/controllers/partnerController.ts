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
import { partnerExist } from "../../app/use_case/partner/partnerUseCase";
import { partnerData } from "../../types/partnerInterface";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { checkUserExists } from "../../app/use_case/auth/userAuth";

const partnerController = (
    // partnerModel : partnerModelType,
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
                console.log("partner found : ", partner)
                const payload = partner?._id ? partner._id.toString() : ''
                console.log("payload============== : ", payload)
                const token = await authServices.jwtGeneration(payload, 'partner')
                console.log("generated token for partner : ", token)
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
            const partnerData : partnerData = JSON.parse(req.query.partnerData as string)
            console.log("PartnerData : ",partnerData)
            const payload = await authServices.tokenVerification(partnerData.token)
            let partnerId : string =''
            if(typeof payload ==='object' && 'payload' in payload)
            {
                partnerId = payload.payload
            }
            console.log(partnerId)
            console.log(partnerData.role)
            const userExists = await checkUserExists(partnerId, userServices)
            console.log("useExists : ",userExists)
            const partnerExists = await partnerExist(partnerId, partnerService)
            // if(partnerExists === null && userExists)
            // {
            //     console.log("entering payment")
            //     userExists.amount = partnerData.amount
            //     userExists.role = "partner"
            //     const paymentStarts = await signUpPayment(userExists, paymentServices)
            //     console.log("payment data recieved :", paymentStarts)
            //     res.json({
            //         data: paymentStarts,
            //         message:"success",
            //     })   
            // }
            // else
            // {
            //     console.log("Partner already exist")
            //     res.json({
            //         data:null,
            //         message:"Partner already exist"
            //     })
            // }
        }
    )

    const transactionHandler = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const transactionId = req.params.transactionId
            const partnerId = req.params.userId
            console.log(transactionId, partnerId)
            const partner = await partnerSignUp(partnerId, transactionId, partnerService)
            console.log("partner :", partner)
            
            res.redirect(`http://localhost:5173/partner/success/${transactionId}/${partnerId}`)
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
            console.log("reached partner for finding one")
            const {id} = req.query
            const partnerId = id as string
            
            console.log("partner id found :", partnerId)
            const findPartner = await partnerExist(partnerId, partnerService)
            res.json(findPartner)
        }
    )

    return {partnersLogin, signUpPartner, transactionHandler, partnerFindAll, findOnePartner}
    
}

export default partnerController