// import { partnerModelType } from "../frameworks/database/mongodb/models/partnerModel";
import { userModelType } from "../frameworks/database/mongodb/models/userModel";
import { HttpStatus } from "../types/httpTypes";
import { partnerDetailInterface } from "../types/partnerInterface";
import AppError from "../utils/appErrors";


export class partnerEntity{
    private model : userModelType

    constructor(model:userModelType){
        this.model = model
    }

    public async partnerLogin (email: string) : Promise<partnerDetailInterface| null>{

        try
        {
            console.log(email)
            const user: partnerDetailInterface | null  = await this.model.findOne({email: email, isPartner: true})
            console.log(user)
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
    public async partnerExist(partnerId:string) : Promise<partnerDetailInterface | null>{
        try
        {
            console.log(partnerId)
            const partner = await this.model.findOne({_id:partnerId, isPartner: true})
            console.log("partner Exist :", partner)
            return partner ? partner as partnerDetailInterface : null
        }
        catch(error:any)
        {
            console.log(error.message)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    public async partnerCreate(userId: string, transactionId: string, purpose: string, amount: number) : Promise<partnerDetailInterface | null>{
        try
        {
            console.log("reached partner entity ")
            const newTransaction = {
                transactionID: transactionId,
                amount:amount,
                purpose: purpose
            }
            console.log("newTransaction : ", newTransaction)
            const partner = await this.model.updateOne({_id:userId}, {$set:{isPartner:true}, $push:{transactions:newTransaction}})
            console.log(partner)
            if(partner.matchedCount > 0 && partner.modifiedCount > 0)
            {
                console.log("partner created : ", partner)
                return partner as partnerDetailInterface
            }
            else
            {
                throw new AppError("Failed to create partner. User not found or update unsuccessful", HttpStatus.NOT_FOUND)
            }
        }
        catch(error:any)
        {
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
