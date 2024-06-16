import { partnerData } from "../../types/partnerInterface"
import { paymentServiceType } from "../../frameworks/services/paymentService"
import { partnerDetailInterface } from "../../types/partnerInterface"
import { userInterface } from "../../types/userInterface"
import { Booking, bookingDetail } from "../../types/bookingInterface"
import { carInterface } from "../../types/carInterface"

export const paymentInterface = (paymentService: ReturnType<paymentServiceType>)=>{
    const paymentPhonepayUser = async(bookingDetail: Partial<bookingDetail>, car: carInterface | carInterface[] | null, userId: string)=>{
        const response = await paymentService.paymentMakingService(bookingDetail, car, userId)
        return response
    }

    const sessionVerification = async(sessionId: string)=>{
        const response = await paymentService.stripeSessionVerify(sessionId)
        return response
    }

    const paymentExtent = async(bookingDetail: Partial<bookingDetail>, car: carInterface | carInterface[] | null, userId: string)=>{
        const response = await paymentService.paymentExtent(bookingDetail, car, userId)
        return response
    }

    const paymentRefund = async(bookingData: Partial<Booking>)=>{
        const response = await paymentService.PaymentRefund(bookingData)
        return response
    }

    const signUpPartnerPayment = async(paymentData : partnerData)=>{
        const response = await paymentService.partnerPaymentForSignUp(paymentData)
        return response
    }
    return {
        signUpPartnerPayment,
        paymentPhonepayUser, 
        sessionVerification, 
        paymentRefund,
        paymentExtent
    }
}

export type paymentInterfaceType = typeof paymentInterface