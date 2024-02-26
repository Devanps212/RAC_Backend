import { Types } from "mongoose"
import session from "express-session"

export interface userInterface {
    _id?: Types.ObjectId,
    name?:string,
    email?:string
    mobile?:number
    password?:string
    DL?:string,
    DOB?:Date,
    profilePic?:string,
    isActive?:boolean,
    isGoogleUser:boolean,
    address?:Array<{
        country?: string;
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        phone?: string;
        alternateNumber?: string;
        landmark?: string;
    }>
}
export interface createUserInterface {
    name:string,
    email:string,
    mobile?:number,
    password?:string,
}


export interface sessionInterface {
    userData?: userInterface,
    otp?: string,
    secret?:{base32 :string}
}

declare module 'express-session'
{
    interface sessionInterface {
        userData?: userInterface,
        otp?: string,
        secret?:{base32 :string}
    }
}
