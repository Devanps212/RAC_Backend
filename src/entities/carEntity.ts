import { Types } from "mongoose";
import { carModelType } from "../frameworks/database/mongodb/models/carModel";
import { carInterface } from "../types/carInterface";
import { HttpStatus } from "../types/httpTypes";
import AppError from "../utils/appErrors";

export class carEntity{
    private model : carModelType

    constructor(model:carModelType)
    {
        this.model = model
    }

    public async addCar(carData:carInterface) : Promise<carInterface | null>
    {
        try
        {
            console.log("car details :", carData)
            const carCreate = await this.model.create(carData)
            if(carCreate)
            {
                console.log("car created")
                return carCreate.toObject()
            }
            else
            {
                throw new AppError('car creation failed', HttpStatus.NOT_IMPLEMENTED)
            }
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError(error.message, HttpStatus.BAD_REQUEST)
        }
    }
    public async editCar(carData:carInterface): Promise<{status:string} | null>
    {
        console.log("reached car Enitity")
        try
        {
            const {_id, ...restData} = carData
            console.log("id :" , _id)
            console.log("rest data : ", restData)
            const dataSave = await this.model.updateOne({_id:_id}, {$set:restData})
            console.log("Data save object result : ", dataSave)
            if(dataSave.matchedCount> 0 && dataSave.modifiedCount > 0)
            {
                const carDetails = await this.model.findOne({_id:_id})
                console.log("car details :", carDetails)
                console.log("car updated")
                return {status:"success"}
            }
            else if(dataSave.matchedCount > 0 && dataSave.modifiedCount == 0)
            {
                throw new AppError('Please edit ssomething to change', HttpStatus.NOT_MODIFIED)
            }
            else
            {
                throw new AppError('car not found', HttpStatus.NOT_FOUND)
            }
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }    
    }
    public async findCar(carData:string):Promise<carInterface[]|carInterface| null>{
        try
        {
            console.log("carData :",carData)
            let allDetails;
            if(carData === 'all')
            {
                allDetails = await this.model.find().populate('category')
                console.log(allDetails)
                return allDetails.map((car)=>car.toObject())
            }
            else if (Types.ObjectId.isValid(carData))
            {
                allDetails = await this.model.findOne({_id:carData})
                if(allDetails)
                {
                return allDetails.toObject()
                } 
            }
            else
            {
                throw new AppError('Car not found', HttpStatus.NOT_FOUND)
            }

            return null
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    public async deleteCar(carId : string): Promise<{status: string, message:string}| null>{
        try
        {
            console.log("carU=Id : ",carId)
            const carDelete = await this.model.deleteOne({_id:carId})
            if(carDelete.deletedCount > 0)
            {
                console.log("car Deleted")
                return{status:'success', message:'car deletd successfully'}
            }
            else
            {
                throw new AppError("can't delete car", HttpStatus.NOT_IMPLEMENTED)
            }
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async viewCarDetails(carId:string) : Promise<carInterface | null >{
        try
        {
            console.log("carId for view details :", carId)
            const details = await this.model.findOne({_id:carId})
            if(!details)
            {
                throw new AppError('car not found', HttpStatus.NOT_FOUND)
            }
            console.log("car details : ",details.toObject())
            return details.toObject()
            
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async checkCarByName(name:string) : Promise<carInterface | {message :string} | null>
    {
        try
        {
            const check = await this.model.findOne({name:name})
            if(check)
            {
                throw new AppError('car exist', HttpStatus.NOT_IMPLEMENTED)
            }
            else
            {
                console.log("car not founnd")
                return {message:"Car not found"}
            }
        }
        catch(error:any)
        {
            console.log(error);
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
            
        }
    }

    
}
