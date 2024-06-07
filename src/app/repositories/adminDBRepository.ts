import { createAdminInterface, adminInterface } from "../../types/adminInterface";
import { adminRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/adminRepositoryMDB";

export const adminDBRepository = (repository: ReturnType<adminRepositoryMongoDB>)=>{
    const getAdminByEmail = async(email:string)=>{
        return await repository.getAdminByEmail(email)
    }
    const createAdmin = async(adminData:adminInterface)=>{
        return await repository.createAdmin(adminData)
    }

    const findOneAdmin = async(data: string)=>{
        const response = await  repository.findOneAdmin(data)
        return response
    }

    const updateAdmin = async(data: Partial<createAdminInterface>)=>{
        const response = await repository.updateAdmin(data)
        return response
    }

    return {getAdminByEmail, 
            createAdmin,
            findOneAdmin,
            updateAdmin
        }
}

export type adminDBInterface = typeof adminDBRepository