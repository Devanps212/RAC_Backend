import { Request, Response } from "express";
import { AuthService } from "../../frameworks/services/authServices";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";
import { adminDBInterface } from "../../app/repositories/adminDBRepository";
import { adminRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/adminRepositoryMDB";
import { adminModel } from "../../frameworks/database/mongodb/models/adminModel";
import expressAsyncHandler from "express-async-handler";
import { loginAdmin } from "../../app/use_case/auth/adminAuth";


export const adminAuthController = (
    adminRepositoryImpl : adminRepositoryMongoDB,
    adminInterfaceDB : adminDBInterface,
    authServiceImpl: AuthService,
    authInterface : InterfaceAuthService,
    adminModel: adminModel
) =>{
    const adminRepoInteface = adminInterfaceDB(adminRepositoryImpl(adminModel))
    const adminAuth = authInterface(authServiceImpl())

    const adminLogin = expressAsyncHandler(
        async(req : Request, res : Response)=>{
            const {email, password} : {email :string, password : string} = req?.body
            console.log("admin email and password : " , email, password)
            const admin = await loginAdmin(email, password, adminRepoInteface, adminAuth)
            const payload = admin._id ? admin._id.toString() : '';
            const token = await adminAuth.jwtGeneration(payload, 'admin')
            res.json({
                status : "success",
                message:"Admin Login Success",
                token
            })
            
            
        }
    )
    return {adminLogin}

}