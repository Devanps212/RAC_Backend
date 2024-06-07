import { Request, Response } from "express";
import { AuthService } from "../../frameworks/services/authServices";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";
import { adminDBInterface } from "../../app/repositories/adminDBRepository";
import { adminRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/adminRepositoryMDB";
import { adminModel } from "../../frameworks/database/mongodb/models/adminModel";
import expressAsyncHandler from "express-async-handler";
import { findOneAdmin, loginAdmin, updateAdmin } from "../../app/use_case/auth/adminAuth";
import { createAdminInterface } from "../../types/adminInterface";


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
            console.log("admin token :", token)
            res.json({
                status : "success",
                message:"Admin Login Success",
                token
            })
            
            
        }
    )

    const findAdminOne = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const adminId = req.query.adminId
            console.log("adminId from query : ", adminId)
            console.log(req.query)
            const admin = await findOneAdmin(String(adminId), adminRepoInteface)
            res.json({
                data: admin,
                status: "success"
            })
        }
    )

    const adminUpdate = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            console.log("reached controller")
            console.log(req.body)
            let data : createAdminInterface = req.body
            console.log('data : ', data)
            
            if(req.files){
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                if (files.profilePic && Array.isArray(files.profilePic) && files.profilePic.length > 0) {
                    const filePath = files.profilePic[0].path;
                    data.profilePic = filePath;
                }
            }
            console.log("datas found : ", data)
            const update = await updateAdmin(data, adminRepoInteface)
            res.json({
                data: update,
                status: "success"
            })
        }
    )


    return {
        adminLogin,
        findAdminOne,
        adminUpdate
    }

}