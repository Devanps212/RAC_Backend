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
        console.log("reached car Enitity");
        try {
            const {_id, deletedExteriorIndex, deletedInteriorIndex, interior, exterior, thumbnailImg, seats, comments, ...restData} = carData;

            const PictureUpdate = await this.model.findOne({_id})

            let shouldUpdateMongo = false;
    
            if (deletedExteriorIndex && PictureUpdate) {
                    console.log("exterior after update:", PictureUpdate);
                    console.log("delted exterior :", deletedExteriorIndex)
                    if (exterior && exterior.length === 1) {
                        PictureUpdate.exterior[parseInt(deletedExteriorIndex)] = exterior[0];
                        shouldUpdateMongo = true;
                    }
                console.log("exterior after update:", PictureUpdate);
            }
            console.log("deleted exterior :",deletedExteriorIndex)
    
            if (deletedInteriorIndex && PictureUpdate) {
                    console.log("Interior before update:", PictureUpdate);
                    console.log("delyted Interior : ", deletedInteriorIndex)
                    if (interior && interior.length === 1) {
                        PictureUpdate.interior[parseInt(deletedInteriorIndex)] = interior[0];
                        shouldUpdateMongo = true;
                    }
                    console.log("Interior after update:", PictureUpdate)
            }
            console.log("delete Interior :" ,deletedInteriorIndex)
    
            if (deletedInteriorIndex || deletedExteriorIndex) {
                        if(interior && interior.length > 1 && PictureUpdate)
                            {
                                PictureUpdate.interior = interior
                                shouldUpdateMongo = true
                            }
                        if(exterior && exterior.length > 1 && PictureUpdate)
                            {
                                PictureUpdate.exterior = exterior
                                shouldUpdateMongo = true
                            }
            }
            if(thumbnailImg && PictureUpdate)
                {
                    PictureUpdate.thumbnailImg = thumbnailImg
                    shouldUpdateMongo = true
                }
            if(seats && PictureUpdate)
                {
                    PictureUpdate.seats = parseInt(seats)
                    shouldUpdateMongo = true
                }
    
            console.log("id :", _id);
            console.log("rest data : ", restData);
    
            if (PictureUpdate) {
                const updatedDocument = await PictureUpdate.save();
                console.log("Updated document:", updatedDocument);
                const dataSave = await this.model.updateOne({_id}, {$set: restData});
                console.log("Data save object result : ", dataSave);
                if (dataSave.matchedCount > 0 && dataSave.modifiedCount > 0) {
                    const carDetails = await this.model.findOne({_id});
                    console.log("car details :", carDetails);
                    console.log("car updated");
                    return {status: "success"};
                } else if (dataSave.matchedCount > 0 && dataSave.modifiedCount === 0) {
                    throw new AppError('Please edit something to change', HttpStatus.NOT_MODIFIED);
                } else {
                    throw new AppError('car not found', HttpStatus.NOT_FOUND);
                }
            } else {
                console.log("No need to update MongoDB");
                return {status: "success"};
            }
        } catch (error: any) {
            console.log(error.message);
            throw new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async findCar(carData:string):Promise<carInterface[]|carInterface| null>{
        try
        {
            console.log("carData :",carData)
            let allDetails;
            if(carData === 'all')
            {
                allDetails = await this.model.find().populate('category').populate('addedById')
                console.log(allDetails)
                return allDetails.map((car)=>car.toObject())
            }
            else if (Types.ObjectId.isValid(carData))
            {
                allDetails = await this.model.findOne({_id:carData}).populate('comments.userId').populate('category')
                if(allDetails)
                {
                    console.log("populated details : ", allDetails)
                return allDetails.toObject()
                } 
            }
            else if(carData === 'partnerCars')
            {
                console.log(carData)
                allDetails = await this.model.find({owner:'Partner'}).populate('category')
                if(allDetails)
                    {
                        return allDetails.map((car)=>car.toObject())
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
