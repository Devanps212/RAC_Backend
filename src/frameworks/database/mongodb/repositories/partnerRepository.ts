import { partnerModelType } from "../models/partnerModel";
import { partnerEntity } from "../../../../entities/partner";

export const partnerDbRepo = (model : partnerModelType)=>{
    const PartnerEntity = new partnerEntity(model)

    const partnerLogin = async(email: string)=>{
        const response = await PartnerEntity.partnerLogin(email)
        return response
    }

    return {partnerLogin}
}

export type partnerRepoType = typeof partnerDbRepo