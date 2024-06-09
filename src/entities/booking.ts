import { Types } from "mongoose"
import { BookingModelType } from "../frameworks/database/mongodb/models/bookingModel"
import { Booking, SessionDataInterface, backendBooking, bookingDetail } from "../types/bookingInterface"
import { HttpStatus } from "../types/httpTypes"
import AppError from "../utils/appErrors"
import { carInterface } from "../types/carInterface"

export class BookingEnity{

    private model : BookingModelType

    constructor(model : BookingModelType){
        this.model  = model
    }

    public async bookingCreation(data: SessionDataInterface, carDetails : carInterface) : Promise<Booking| null>{
        try
        {
            console.log("reached booking entity")
            const addedById = carDetails.addedById
            const addedRole = carDetails.owner
            console.log("whole data : ", data)
            console.log("booking Detail :", data.transactionId)
            console.log("booking Detail :", data.carId)
            console.log("booking Detail :", data.bookingDetails)
            let bookingFormat : Booking | null = null;
            const { pickupLocation, dropOffLocation, pickupTime, dropOffTime, startDate, endDate, amount, total } = data.bookingDetails;
            console.log("checking condition")
            console.log(pickupLocation, dropOffLocation, pickupTime, dropOffTime, startDate, endDate, amount)
            if (pickupLocation !== undefined && 
                dropOffLocation !== undefined && 
                pickupTime !== undefined && 
                dropOffTime !== undefined && 
                startDate !== undefined && 
                endDate !== undefined && 
                total !== undefined && 
                addedById !== undefined && 
                addedRole !== undefined) {
                console.log("booking format")
                bookingFormat = {
                    carId: carDetails._id?.toString() ?? '',
                    userId: data.userId,
                    date: { start: startDate, end: endDate },
                    location: { start: pickupLocation, end: dropOffLocation },
                    time: { start: pickupTime, end: dropOffTime },
                    status: 'Confirmed',
                    owner: addedById,
                    transaction: { amount: total , transactionId: data.transactionId },
                    ownerRole: addedRole,
                    issues:'',
                };
                console.log(bookingFormat)
            }

            const bookingData = await this.model.create(bookingFormat)
        
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
            console.log(error)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async findBooking(data: string) : Promise<Booking[] | Booking | {message: string} | null | undefined >{
        try{
            
            if(data === 'all'){
                const bookingFinding = await this.model.find().populate("carId")
                
                if(bookingFinding.length ===0){
                    return {message:"no bookings found"}
                }
                else{
                    return bookingFinding.map(booking=>booking.toObject())
                }
            }
            else if(Types.ObjectId.isValid(data)){
                const bookingFinding = await this.model.findOne({_id:data}).populate("carId")
                if(bookingFinding){
                        return bookingFinding.toObject()
                    }
                    else{
                        return {message: "not found"}
                    }
            }
            else
            {
                console.log("no booking found")
                return null
            }
            
        }
        catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async bookingFindingBasedOnRole(bookingData: Partial<Booking>): Promise<Booking | Booking[]>{
        try{
            console.log("updating")
            const bookingDetail = await this.model.find(bookingData).populate('carId')
            if (bookingDetail.length === 0) {
                return []; 
            } else if (bookingDetail.length === 1) {
                return bookingDetail[0].toObject(); // 
            } else {
                return bookingDetail.map(booking => booking.toObject()); 
            }
        } catch(error:any){
            console.log(error)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async BookingUpdater(data: Partial<Booking>):Promise<Booking| {message: string}>{
        try{
            console.log("reached booking updating")
            if (!data._id) {
                return { message: "No booking ID provided" };
            }
            const bookingId = data._id 

            const booking = await this.model.findById(bookingId)
            if(booking){
                console.log("datas for update : ", data)
                if(Object.keys(data).length > 0){
                    Object.assign(booking, data)
                    console.log("updating booking :", booking)
                    await booking.save()
                    return booking.toObject()
                } else {
                    return {message: "nothing to save"}
                }
            } else {
                return {message: "no bookings found"}
            }
        }catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}