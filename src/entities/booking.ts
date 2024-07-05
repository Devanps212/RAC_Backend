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
            const addedById = carDetails.addedById
            const addedRole = carDetails.owner
            
            let bookingFormat : Booking | null = null;
            const { pickupLocation, dropOffLocation, pickupTime, dropOffTime, startDate, endDate, amount, total } = data.bookingDetails;
            
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
                
            }

            const bookingData = await this.model.create(bookingFormat)
        
            if(bookingData !== null){
                
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
            
            const bookingDetail = await this.model.find(bookingData).populate('carId').exec();
            
            if (bookingDetail.length === 0) {
                return []; 
            } else if (bookingDetail.length === 1) {
                console.log("booking details : ", bookingDetail)
                return bookingDetail[0].toObject(); 
            } else {
                console.log("booking details : ", bookingDetail)
                return bookingDetail.map(booking => booking.toObject()); 
            }
        } catch(error:any){
            console.log(error)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async BookingUpdater(data: Partial<Booking>):Promise<Booking| {message: string}>{
        try{
            
            if (!data._id) {
                return { message: "No booking ID provided" };
            }
            const bookingId = data._id 

            const booking = await this.model.findById(bookingId)
            if(booking){
                
                if(Object.keys(data).length > 0){
                    Object.assign(booking, data)
                    
                    await booking.save()
                    return booking.toObject()
                } else {
                    return {message: "nothing to save"}
                }
            } else {
                return {message: "no bookings found"}
            }
        }catch(error: any){
            console.error(error)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async BookingPagination(data: string | Partial<Booking>, page: number, limit: number): Promise<{formattedBookings: Booking[], totalCount: number}> {
        try {
            let bookings;
            let totalCount;

            if (typeof data === "string") {
                
                bookings = await this.model.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('carId')
                    .exec();

                totalCount = await this.model.countDocuments();
            } else {
                
                bookings = await this.model.find({ ...data })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('carId')
                    .exec();

                totalCount = await this.model.countDocuments({ ...data });
            }

            
            const formattedBookings: Booking[] = bookings.map((booking) => booking.toObject());

            return {
                formattedBookings,
                totalCount
            };
        } catch (error: any) {
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}