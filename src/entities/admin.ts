import { createAdminInterface, adminInterface } from "../types/adminInterface";
import {adminModel} from "../frameworks/database/mongodb/models/adminModel";


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
}