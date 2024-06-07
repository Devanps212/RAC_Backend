import { adminDBInterface } from "../../repositories/adminDBRepository";
import { InterfaceAuthService } from "../../services/authServiceInterface";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";
import { createAdminInterface } from "../../../types/adminInterface";


export const loginAdmin = async(email : string, password : string, adminDBinterface : ReturnType<adminDBInterface>, adminAuthInterface: ReturnType<InterfaceAuthService>)=>
{
    try
    {
    const admin = await adminDBinterface.getAdminByEmail(email)

    if(!admin)
    {
        throw new AppError('admin Not found', HttpStatus.UNAUTHORIZED)
    }
    
        console.log("admin exist")
        const passCheck = await adminAuthInterface.decryptPassword(password, admin.password)
        if(!passCheck)
        {
            throw new AppError('Password is in correct', HttpStatus.UNAUTHORIZED)
        }
            console.log("admin password is correct")
            return admin
    }
    catch(error: any)
    {
        console.log(error.message)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const findOneAdmin = async(adminId: string, adminDBinterface : ReturnType<adminDBInterface>)=>{
    const user = await adminDBinterface.findOneAdmin(adminId)
    return user
}

export const updateAdmin = async(data: Partial<createAdminInterface>, adminDBinterface : ReturnType<adminDBInterface>)=>{
    const user = await adminDBinterface.updateAdmin(data)
    return user
}