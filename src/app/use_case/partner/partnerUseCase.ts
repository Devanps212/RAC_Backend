import { partnerInterfaceType } from "../../repositories/partnerRepoInterface";
import { paymentInterfaceType } from "../../services/paymentInterface";
import { partnerDetailInterface } from "../../../types/partnerInterface";
import { userInterface } from "../../../types/userInterface";

export const partnerExist = async(partnerId : string, partnerInterface:ReturnType<partnerInterfaceType>)=>{
    const response = await partnerInterface.partnerExist(partnerId)
    return response
}

// export const signUpPayment = async(userData:userInterface,paymentInterface: ReturnType<paymentInterfaceType>)=>{
//     console.log("passing response")
//     const response = await paymentInterface.paymentPhonepayUser(userData)
//     return response
// }