import { partnerData } from "../../types/partnerInterface"
import { paymentServiceType } from "../../frameworks/services/paymentService"
import { partnerDetailInterface } from "../../types/partnerInterface"
import { userInterface } from "../../types/userInterface"
import { Booking, bookingDetail } from "../../types/bookingInterface"
import { carInterface } from "../../types/carInterface"

export const paymentInterface = (paymentService: ReturnType<paymentServiceType>)=>{
    const paymentPhonepayUser = async(bookingDetail: bookingDetail, car: carInterface | carInterface[] | null, userId: string)=>{
        const response = await paymentService.paymentMakingService(bookingDetail, car, userId)
        return response
    }

    const sessionVerification = async(sessionId: string)=>{
        const response = await paymentService.stripeSessionVerify(sessionId)
        return response
    }

    const paymentRefund = async(bookingData: Partial<Booking>)=>{
        const response = await paymentService.PaymentRefund(bookingData)
        return response
    }
    return {paymentPhonepayUser, sessionVerification, paymentRefund}
}

export type paymentInterfaceType = typeof paymentInterface