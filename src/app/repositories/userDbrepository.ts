import { createUserInterface, userInterface } from "../../types/userInterface";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";

export const userdbRepository = (repository: ReturnType<userRepository>)=>{
    const createUser = async(user: createUserInterface)=>{
        return await repository.createUser(user)
    }
    const getUserByEmail = async(email:string)=>{
        return await repository.getUserByEmail(email)
    }
    const getAllUsers = async()=>{
        return await repository.getAllUser()
    }

    const blockUnblockUser = async(userId:string)=>{
        await repository.blockUnblockUser(userId)
    }
    const findOneUser = async(userId: string)=>{
        const user = await repository.findOneUser(userId)
        return user
    }

    const findUser = async(id: string)=>{
        const user = await repository.findUser(id)
        return user
    }
    return {
        createUser,
        getUserByEmail,
        getAllUsers,
        blockUnblockUser,
        findOneUser,
        findUser
    }
    
}

export type userDbInterface = typeof userdbRepository;