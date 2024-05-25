import { BookingEnity } from "../../../../entities/booking";
import { Booking, SessionDataInterface, backendBooking, bookingDetail } from "../../../../types/bookingInterface";
import { carInterface } from "../../../../types/carInterface";
import { BookingModelType } from "../models/bookingModel";


export const bookingRepository = (bookingModel : BookingModelType)=>{

    const enitityBooking = new BookingEnity(bookingModel)

    const createBooking = async(data: SessionDataInterface, carDetail : carInterface)=>{
        const response = await enitityBooking.bookingCreation(data, carDetail)
        return response
    }

    const findBooking = async(bookingDetail: string)=>{
        console.log("reached repository")
        const response = await enitityBooking.findBooking(bookingDetail)
        return response
    }

    const bookingFindinBaedOnRole = async(bookingData:Partial<Booking>)=>{
        const response = await enitityBooking.bookingFindingBasedOnRole(bookingData)
        return response
    }

    const bookingUpdater = async(data: Partial<Booking>)=>{
        const response = await enitityBooking.BookingUpdater(data)
        return response
    }

    return{
        createBooking,
        findBooking,
        bookingFindinBaedOnRole,
        bookingUpdater
    }
}

export type bookingRepositoryType = typeof bookingRepository 