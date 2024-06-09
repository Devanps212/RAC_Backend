import { bookingInterfaceType } from "../../repositories/bookingDBInterface";
import { Booking, SessionDataInterface, backendBooking, bookingDetail } from "../../../types/bookingInterface";
import { carInterface } from "../../../types/carInterface";
import { paymentInterface, paymentInterfaceType } from "../../services/paymentInterface";


export const createBooking = async(data: SessionDataInterface, carDetails : carInterface,bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.createBooking(data, carDetails)
    return response 
}

export const findBooking = async(data:string, bookingInterface: ReturnType<bookingInterfaceType>)=>{
    console.log("reached usecase")
    const response = await bookingInterface.findBooking(data)
    return response
}

export const bookingPayment = async(bookingDetail : Partial<bookingDetail>, car: carInterface | carInterface[] | null, userId: string ,paymentInterface: ReturnType<paymentInterfaceType>)=>{
    const response = await paymentInterface.paymentPhonepayUser(bookingDetail, car, userId)
    return response
}

export const bookingBasedOnRole = async(bookingData: Partial<Booking>, bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.bookingBasedOnRole(bookingData)
    return response
}

export const BookingUpdater = async(data: Partial<Booking> , bookingInterface: ReturnType<bookingInterfaceType>)=>{
    console.log(data)
    const response = await bookingInterface.bookingUpdater(data)
    return response
}

export const bookingReschedule = async(bookingDetail : Partial<bookingDetail>, car: carInterface | carInterface[] | null, userId: string ,paymentInterface: ReturnType<paymentInterfaceType>)=>{
    const response = await paymentInterface.paymentExtent(bookingDetail, car, userId)
    return response
}

export const stripePaymentVeification = async(sessionId: string, paymentInterface: ReturnType<paymentInterfaceType>)=>{
    const response = await paymentInterface.sessionVerification(sessionId)
    return response
}


export const stripeRefund = async(data: Partial<Booking>, paymentInterface: ReturnType<paymentInterfaceType>)=>{
    const response = await paymentInterface.paymentRefund(data)
    return response
}