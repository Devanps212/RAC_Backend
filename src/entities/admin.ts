import { createAdminInterface, adminInterface } from "../types/adminInterface";
import {adminModel} from "../frameworks/database/mongodb/models/adminModel";
import AppError from "../utils/appErrors";
import { HttpStatus } from "../types/httpTypes";


export class adminEntity{
    private model : adminModel

    constructor(model : adminModel)
    {
        this.model = model
    }

    public async createAdmin(adminData : adminInterface) : Promise<adminInterface | null>
    {
            const admin = await this.model.create(adminData)
            return admin
    }
    public async getAdminByEmail(email :string): Promise<createAdminInterface | null>
    {
        const adminData = await this.model.findOne({email})
        
        return adminData
    }
    public async findOneAdmin(id:string):Promise<createAdminInterface>{
        const admin = await this.model.findOne({_id: id})
        if(!admin){
            throw new AppError('Admin not found', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        

        return admin
    }
    public async updateAdmin(data: Partial<createAdminInterface>):Promise<createAdminInterface>{
        try{
            
            if(Object.keys(data).length === 0){
                throw new AppError('Provide something to update Admin', HttpStatus.NOT_IMPLEMENTED)
            }
            
            const admin = await this.model.findOne({_id: data._id})
            
            if(!admin){
                throw new AppError('No admin found', HttpStatus.NOT_FOUND)
            }

            Object.assign(admin, data)

            const saveAdmin = await admin.save()
            
            if(!saveAdmin){
                throw new AppError('admin update failed', HttpStatus.NOT_MODIFIED)
            }

            return saveAdmin

        } catch(error: any){
            console.log(error)
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}