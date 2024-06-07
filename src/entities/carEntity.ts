import { Types } from "mongoose";
import { carModelType } from "../frameworks/database/mongodb/models/carModel";
import { carInterface } from "../types/carInterface";
import { HttpStatus } from "../types/httpTypes";
import AppError from "../utils/appErrors";
import { HttpStatusCode } from "axios";

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
            }
    
            if (deletedInteriorIndex && PictureUpdate) {
                    console.log("Interior before update:", PictureUpdate);
                    console.log("delyted Interior : ", deletedInteriorIndex)
                    if (interior && interior.length === 1) {
                        PictureUpdate.interior[parseInt(deletedInteriorIndex)] = interior[0];
                        shouldUpdateMongo = true;
                    }
            }
    
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
    
    
            if (PictureUpdate) {
                const updatedDocument = await PictureUpdate.save();
                const dataSave = await this.model.updateOne({_id}, {$set: restData});

                if ((updatedDocument !== null || (dataSave !== undefined && dataSave.matchedCount > 0 && dataSave.modifiedCount > 0))) {
                    
                    const carDetails = await this.model.findOne({_id});

                    console.log("car updated");
                    return {status: "success"};
                } else if (dataSave !== undefined && dataSave.matchedCount > 0 && dataSave.modifiedCount === 0 && updatedDocument === null) {
                    throw new AppError('Please edit something to change', HttpStatus.NOT_MODIFIED);
                } else {
                    throw new AppError('car not found or update failed', HttpStatus.NOT_FOUND);
                }
            } else {
                console.log("No need to update MongoDB");
                return {status: "success"};
            }
        } catch (error: any) {
            throw new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async findCar(carData:string):Promise<carInterface[]|carInterface| null>{
        try
        {
            let allDetails;
            if(carData === 'all')
            {
                allDetails = await this.model.find().populate('category').populate('addedById')
                return allDetails.map((car)=>car.toObject())
            }
            else if (Types.ObjectId.isValid(carData))
            {
                allDetails = await this.model.findOne({_id:carData}).populate('comments.userId').populate('category')
                if(allDetails)
                {
                    return allDetails.toObject()
                } 
            }
            else if(carData === 'partnerCars')
            {
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

    public async viewCarDetails(carId:string) : Promise<carInterface | {message: string} | null >{
        try
        {
            console.log("carId for view details :", carId)
            const details = await this.model.findOne({_id:carId})
            if(!details)
            {
                return {message: "not found"}
            }
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
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
            
        }
    }

    public async carUpdater(carId: string, dataUpdate: Partial<carInterface>): Promise<{message: string, carData:carInterface | null}>{
        try{
            const car = await this.model.findById(carId)

            if (!car) {
                throw new Error('Car not found');
            }

            if(dataUpdate && Object.keys(dataUpdate).length > 0){
                Object.assign(car, dataUpdate)
                await car.save();
                return {message:"car Updated SuccessFully", carData: car.toObject()}
                
            }
            else{
                return {message:"updation failed", carData: null}
            }
            
        }catch(error:any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async carBasedOnRole(role: string): Promise<carInterface[] | carInterface>{
        try{
            const cars = await this.model.find({owner: role})
            if(cars === null){
                throw new AppError('no cars found', HttpStatus.NOT_FOUND)
            }
            return cars.map(car=>car.toObject())
        } catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async carPartialUpdate(data: Partial<carInterface>): Promise<Partial<carInterface>> {
        try {
            if (!data._id) {
                throw new AppError('Car ID is required', HttpStatus.BAD_REQUEST);
            }
    
            const car = await this.model.findByIdAndUpdate(
                data._id,
                { $set: data },
                { new: true, runValidators: true }
            ).lean();
    
            if (!car) {
                throw new AppError('No car found', HttpStatus.NOT_FOUND);
            }
    
            const updatedCar = await this.model.findById({_id: data._id})
            if(!updatedCar){
                throw new AppError("no car updated", HttpStatus.NOT_FOUND)
            }

            return updatedCar.toObject()
           
    
        } catch (error: any) {
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


