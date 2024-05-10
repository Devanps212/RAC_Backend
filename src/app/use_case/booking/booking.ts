import { bookingInterfaceType } from "../../repositories/bookingDBInterface";
import { Booking, SessionDataInterface, backendBooking, bookingDetail } from "../../../types/bookingInterface";
import { carInterface } from "../../../types/carInterface";
import { paymentInterfaceType } from "../../services/paymentInterface";


export const createBooking = async(data: SessionDataInterface, carDetails : carInterface,bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.createBooking(data, carDetails)
    return response 
}

export const findBooking = async(data:string, bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.findBooking(data)
    return response
}

export const bookingPayment = async(bookingDetail : bookingDetail, car: carInterface | carInterface[] | null, userId: string ,paymentInterface: ReturnType<paymentInterfaceType>)=>{
    const response = await paymentInterface.paymentPhonepayUser(bookingDetail, car, userId)
    return response
}

export const bookingBasedOnRole = async(bookingData: Partial<Booking>, bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.bookingBasedOnRole(bookingData)
    return response
}

export const BookingUpdater = async(data: Partial<Booking> , bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.bookingUpdater(data)
    return response
}