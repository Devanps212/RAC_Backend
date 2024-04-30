import { BookingModelType } from "../frameworks/database/mongodb/models/bookingModel"
import { Booking } from "../types/bookingInterface"
import { HttpStatus } from "../types/httpTypes"
import AppError from "../utils/appErrors"

export class BookingEnity{

    private model : BookingModelType

    constructor(model : BookingModelType){
        this.model  = model
    }

    public async bookingCreation(data: Booking) : Promise<Booking| null>{
        try
        {
            console.log("booking Data: ", data)

            const bookingData = await this.model.create(data)
            if(bookingData !== null){
                console.log("Booked")
                return bookingData.toObject()
            }
            else{
                console.log("can't book")
                throw new AppError("can't book", HttpStatus.BAD_REQUEST)
            }
        }
        catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async findBooking(data: string) : Promise<Booking | {message: string} | null >{
        try{
            const bookingFinding = await this.model.findOne({_id:data})
            if(bookingFinding)
                {
                    return bookingFinding.toObject()
                }
                else
                {
                    return {message: "not found"}
                }
        }
        catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}