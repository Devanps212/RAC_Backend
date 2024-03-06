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
                return carCreate
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
    public async editCar(carData:carInterface): Promise<carInterface | null>
    {
        //remove null do here 
        return null
    }
}
