import { createAdminInterface, adminInterface } from "../../../../types/adminInterface";
import { adminEntity } from "../../../../entities/admin";
import { adminModel } from "../models/adminModel";

export const adminRepositoryMDB = (model: adminModel)=>
{
    const AdminEntity = new adminEntity(model)

    const createAdmin = async(adminData: adminInterface)=>
    {
        const admin = await AdminEntity.createAdmin(adminData)
        return admin
    }
    const getAdminByEmail = async(email:string)=>{
        const admin = await AdminEntity.getAdminByEmail(email)
        return admin
    }

    return {createAdmin,getAdminByEmail}
}
export type adminRepositoryMongoDB = typeof adminRepositoryMDB