import { createUserInterface, userInterface } from "../../../../types/userInterface";
import { UserEntity } from "../../../../entities/user";
import { userModelType } from "../models/userModel";


export const userRepository = (model:userModelType)=>{
    const userEntity = new UserEntity(model)
    const createUser = async(user:createUserInterface)=>{
        const newUser = await userEntity.createUser(user)
        return newUser
    }
    const getUserByEmail = async(email:string)=>{
        const user = await userEntity.getUserByEmail(email)
        return user
    }

    const getAllUser = async()=>{
        const users = await userEntity.allUser()
        return users
    }
    
    const blockUnblockUser = async(userId:string)=>{
        await userEntity.blockUnblockUser(userId)
    }

    const findOneUser = async(userId:string)=>{
        const user = await userEntity.userFindOne(userId)
        return user
    }

    const findUser = async(id: string)=>{
        const user = await userEntity.findUsers(id)
        return user
    }
    return {createUser, getUserByEmail, getAllUser, blockUnblockUser, findOneUser, findUser}
}

export type userRepository = typeof userRepository