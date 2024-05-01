import { bookingInterfaceType } from "../../repositories/bookingDBInterface";
import { Booking } from "../../../types/bookingInterface";


export const createBooking = async(data: Booking, bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.createBooking(data)
    return response 
}

export const findBooking = async(data:string, bookingInterface: ReturnType<bookingInterfaceType>)=>{
    const response = await bookingInterface.findBooking(data)
    return response
}
