import { partnerModelType } from "../../frameworks/database/mongodb/models/partnerModel";
import { partnerRepoType } from "../../frameworks/database/mongodb/repositories/partnerRepository";
import { partnerInterfaceType } from "../../app/repositories/partnerRepoInterface";
import { Request, Response } from "express";
import { partnerLogin } from "../../app/use_case/auth/partnerUseCase";
import { AuthService } from "../../frameworks/services/authServices";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";
import expressAsyncHandler from "express-async-handler";

const partnerController = (
    partnerModel : partnerModelType,
    partnerRepository: partnerRepoType,
    partnerInterface : partnerInterfaceType,
    authService: AuthService,
    authServiceInterface: InterfaceAuthService
)=>{

    const partnerService = partnerInterface(partnerRepository(partnerModel))
    const authServices = authServiceInterface(authService())

    const partnersLogin = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const {formData} = req?.body
            const {email, password} =formData
            if(email && password)
            {
                const partner = await partnerLogin(email, password, partnerService, authServices)
                const payload = partner?._id ? partner._id.toString() : ''
                console.log(payload)
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

    return {partnersLogin}
    
}

export default partnerController