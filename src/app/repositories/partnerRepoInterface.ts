import { partnerRepoType } from "../../frameworks/database/mongodb/repositories/partnerRepository";


export const partnerRepoInterface = (repository : ReturnType<partnerRepoType>)=>{

    const partnerLogin = async(email:string)=>{
        const response = await repository.partnerLogin(email)
        return response
    }

    const partnerExist = async(userId: string)=>{
        const response = await repository.partnerexist(userId)
        return response
    }

    const partnerSignup = async(userId : string, transactionId: string, purpose: string, amount: number)=>{
        const response = await repository.partnerSignUp(userId, transactionId, purpose, amount)
        return response
    }

    
    return {partnerLogin, partnerExist, partnerSignup}
}

export type partnerInterfaceType = typeof partnerRepoInterface