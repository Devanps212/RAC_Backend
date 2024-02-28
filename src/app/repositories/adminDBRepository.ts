import { createAdminInterface, adminInterface } from "../../types/adminInterface";
import { adminRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/adminRepositoryMDB";

export const adminDBRepository = (repository: ReturnType<adminRepositoryMongoDB>)=>{
    const getAdminByEmail = async(email:string)=>{
        return await repository.getAdminByEmail(email)
    }
    const createAdmin = async(adminData:adminInterface)=>{
        return await repository.createAdmin(adminData)
    }

    return {getAdminByEmail, createAdmin}
}

export type adminDBInterface = typeof adminDBRepository