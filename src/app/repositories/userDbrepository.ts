import { createUserInterface, userInterface } from "../../types/userInterface";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { UserEntity } from "../../entities/user";



export const userdbRepository = (repository: ReturnType<userRepository>)=>{
    const createUser = async(user: createUserInterface)=>{
        return await repository.createUser(user)
    }
    const getUserByEmail = async(email:string)=>{
        return await repository.getUserByEmail(email)
    }
    return {
        createUser,
        getUserByEmail
    }
}

export type userDbInterface = typeof userdbRepository;