import { partnerData } from "../../types/partnerInterface"
import { paymentServiceType } from "../../frameworks/services/paymentService"
import { partnerDetailInterface } from "../../types/partnerInterface"
import { userInterface } from "../../types/userInterface"

export const paymentPhonepayInterface = (paymentService: ReturnType<paymentServiceType>)=>{
    const paymentPhonepayUser = async(userData: userInterface)=>{
        const response = await paymentService.paymentMakingService(userData)
        return response
    }
    return {paymentPhonepayUser}
}

export type paymentInterfaceType = typeof paymentPhonepayInterface