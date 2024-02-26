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
    return {createUser, getUserByEmail}
}

export type userRepository = typeof userRepository