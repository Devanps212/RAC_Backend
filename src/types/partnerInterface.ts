import { Types } from "mongoose";

export interface partnerLoginInterface {
    email?:string,
    password?:string
}

export interface partnerDetailInterface extends partnerLoginInterface {
    _id:Types.ObjectId;
    mobile?: number | null;
    password?: string;
    profilePic?: string;
    DL?: string;
    DOB?: Date;
    address?: Address[];
    createdAt?: Date;
    isActive?: boolean;
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