import { createUserInterface, userInterface } from "../../../../types/userInterface";
import { UserEntity } from "../../../../entities/user";
import { userModelType, usersModel } from "../models/userModel";


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
        console.log("userId: ", userId)
        const user = await userEntity.userFindOne(userId)
        return user
    }

    const findUser = async(id: string)=>{
        const user = await userEntity.findUsers(id)
        return user
    }

    const updateUser = async(data: Partial<userInterface>)=>{
        const response = await userEntity.userUpdate(data)
        return response
    }

    const findMongoAllUsers = async()=>{
        const response = await userEntity.findAllUsersFromMongo()
        return response
    }
    
    const findUsersForConversation = async(id: string)=>{
        const response = await userEntity.findUsersForConversation(id)
        return response
    } 

    return {
        createUser, 
        getUserByEmail, 
        getAllUser, 
        blockUnblockUser, 
        findOneUser, 
        findUser, 
        updateUser, 
        findMongoAllUsers,
        findUsersForConversation
    }
}

export type userRepository = typeof userRepository