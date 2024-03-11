import { partnerModelType } from "../frameworks/database/mongodb/models/partnerModel";
import { HttpStatus } from "../types/httpTypes";
import { partnerDetailInterface, partnerLoginInterface } from "../types/partnerInterface";
import AppError from "../utils/appErrors";


export class partnerEntity{
    private model : partnerModelType

    constructor(model:partnerModelType){
        this.model = model
    }

    public async partnerLogin (email: string) : Promise<partnerDetailInterface| null>{

        try
        {
            console.log(email)
            const user: partnerDetailInterface | null  = await this.model.findOne({email: email})
            if(!user)
            {
                throw new AppError('User not found', HttpStatus.UNAUTHORIZED)
            }
            return user
            
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}