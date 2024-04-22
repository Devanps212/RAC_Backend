import { Types } from "mongoose";

export interface carInterface {
    _id?:Types.ObjectId;
    name?: string;
    owner?: string;
    category?: Types.ObjectId | string;
    price?: number;
    mileage?: number;
    engine?: string;
    transmission?: string;
    fuelType?: string;
    interior?: string[];
    exterior?: string[];
    status?: string;
    rating?: number;
    description?: string;
    comments?: string[];
    vehicleNumber?: string;
    rentPricePerWeek?: number;
    rentPricePerDay?: number;
    insuranceDetails?: string;
    addedBy?: string;
    addedById?:string;
    deletedInteriorIndex: string
    deletedExteriorIndex: string 
}

interface ImageFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }
  
  export interface ImageData {
    [fieldname: string]: ImageFile[];
  }