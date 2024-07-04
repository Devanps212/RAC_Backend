// import { partnerModelType } from "../frameworks/database/mongodb/models/partnerModel";
import { userModelType } from "../frameworks/database/mongodb/models/userModel";
import { HttpStatus } from "../types/httpTypes";
import { partnerDetailInterface } from "../types/partnerInterface";
import { userInterface } from "../types/userInterface";
import AppError from "../utils/appErrors";


export class partnerEntity{
    private model : userModelType

    constructor(model:userModelType){
        this.model = model
    }

    public async partnerLogin (email: string) : Promise<partnerDetailInterface| null>{

        try
        {
           
            const user: partnerDetailInterface | null  = await this.model.findOne({email: email, isPartner: true})
           
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
    public async partnerExist(partnerId:string) : Promise<userInterface | null>{
        try
        {
            const partner = await this.model.findOne({_id:partnerId, isPartner: true})
            
            return partner ? partner.toObject() : null;
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
           
            const newTransaction = {
                transactionID: transactionId,
                amount:amount,
                purpose: purpose
            }
            
            const partner = await this.model.updateOne({_id:userId}, {$set:{isPartner:true}, $push:{transactions:newTransaction}})
            
            if(partner.matchedCount > 0 && partner.modifiedCount > 0)
            {
                
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

    public async findAllPartner(): Promise<partnerDetailInterface[] | partnerDetailInterface> {
        try{
            const partners = await this.model.find({isPartner:true})
            if(partners === null){
                throw new AppError("no partners Found", HttpStatus.NOT_FOUND)
            }

            return partners.map(partner=>partner.toObject())
        } catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}

