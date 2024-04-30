import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { Booking } from "../../types/bookingInterface";

export const bookingDBInterface = (repository: ReturnType<bookingRepositoryType>)=>{

    const createBooking = async(dataDetail: Booking)=>{
        const bookingCreation = await repository.createBooking(dataDetail)
        return bookingCreation
    }

    const findBooking = async(data: string )=>{
        const findingBooking = await repository.findBooking(data)
        return findingBooking
    }

    return{
        createBooking,
        findBooking
    }
}

export type bookingInterfaceType  = typeof bookingDBInterface