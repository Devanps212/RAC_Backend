import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { Booking, SessionDataInterface, backendBooking, bookingDetail } from "../../types/bookingInterface";
import { carInterface } from "../../types/carInterface";

export const bookingDBInterface = (repository: ReturnType<bookingRepositoryType>)=>{

    const createBooking = async(dataDetail: SessionDataInterface, carDetail: carInterface )=>{
        const bookingCreation = await repository.createBooking(dataDetail, carDetail)
        return bookingCreation
    }

    const findBooking = async(data: string )=>{
        const findingBooking = await repository.findBooking(data)
        return findingBooking
    }

    const bookingBasedOnRole = async(bookingData : Partial<Booking>)=>{
        const response = await repository.bookingFindinBaedOnRole(bookingData)
        return response
    }

    const bookingUpdater = async(data: Partial<Booking>)=>{
        console.log(data)
        const response = await repository.bookingUpdater(data)
        return response
    }
    return{
        createBooking,
        findBooking,
        bookingBasedOnRole,
        bookingUpdater

    }
}

export type bookingInterfaceType  = typeof bookingDBInterface