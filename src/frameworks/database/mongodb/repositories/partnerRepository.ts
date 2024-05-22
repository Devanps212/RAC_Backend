// import { partnerModelType } from "../models/partnerModel";
import { userModelType } from "../models/userModel";
import { partnerEntity } from "../../../../entities/partner";

export const partnerDbRepo = (model : userModelType)=>{
    const PartnerEntity = new partnerEntity(model)

    const partnerLogin = async(email: string)=>{
        const response = await PartnerEntity.partnerLogin(email)
        return response
    }

    const partnerexist = async(partnerId: string)=>{
        const response = await PartnerEntity.partnerExist(partnerId)
        return response
    }

    const partnerSignUp = async(userId : string, transactionId: string, purpose: string, amount: number)=>{
        const response = await PartnerEntity.partnerCreate(userId, transactionId, purpose, amount)
        return response
    }

    const findAllPartner = async()=>{
        const response = await PartnerEntity.findAllPartner()
        return response
    }

    return {partnerLogin, partnerexist, partnerSignUp, findAllPartner}
}

export type partnerRepoType = typeof partnerDbRepo