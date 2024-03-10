import { userDbInterface } from "../../repositories/userDbrepository";


export const getAllUser = async(userInterface: ReturnType<userDbInterface>)=>{
        const users = await userInterface.getAllUsers()
        console.log("users : ",users)
        return users
}

export const blockUnblockUser = async(userId:string, userInterface: ReturnType<userDbInterface>)=>{
        await userInterface.blockUnblockUser(userId)
}

export const findOneUser = async(userId: string, userInterface: ReturnType<userDbInterface>)=>{
        const user = await userInterface.findOneUser(userId)
        return user
}

