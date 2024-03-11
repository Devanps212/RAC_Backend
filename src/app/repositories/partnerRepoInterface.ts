import { partnerRepoType } from "../../frameworks/database/mongodb/repositories/partnerRepository";


export const partnerRepoInterface = (repository : ReturnType<partnerRepoType>)=>{

    const partnerLogin = async(email:string)=>{
        const response = await repository.partnerLogin(email)
        return response
    }
    return {partnerLogin}
}

export type partnerInterfaceType = typeof partnerRepoInterface