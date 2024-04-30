import { BookingEnity } from "../../../../entities/booking";
import { Booking } from "../../../../types/bookingInterface";
import { BookingModelType } from "../models/bookingModel";


export const bookingRepository = (bookingModel : BookingModelType)=>{

    const enitityBooking = new BookingEnity(bookingModel)

    const createBooking = async(data: Booking)=>{
        const response = await enitityBooking.bookingCreation(data)
        return response
    }

    const findBooking = async(bookingDetail: string)=>{
        const response = await enitityBooking.findBooking(bookingDetail)
        return response
    }

    return{
        createBooking,
        findBooking
    }
}

export type bookingRepositoryType = typeof bookingRepository 