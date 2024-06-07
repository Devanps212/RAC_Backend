import { Types } from "mongoose";

export interface partnerLoginInterface {
    email?:string,
    password?:string
}

export interface partnerDetailInterface extends partnerLoginInterface {
    _id?:Types.ObjectId;
    mobile?: number | null;
    password?: string;
    profilePic?: string;
    DL?: string;
    address?: Address[];
    createdAt?: Date;
    isActive?: boolean;
    amount?:number;
    isPartner?:boolean;
    isGoogleUser?:boolean
    transaction?: transaction[]
}

interface transaction {
    transactionID: string,
    amount:number,
    purpose:string,
}

interface Address {
    country?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    alternateNumber?: string;
    landmark?: string;
}

export interface partnerData {
    token:string,
    amount:number,
    role:string
}