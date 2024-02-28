import { Types } from "mongoose"
import { GeneratedSecret } from 'speakeasy';

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
    isGoogleUser?:boolean,
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
export interface SecretObjectInterface {
    ascii: string;
    hex: string;
    base32: string;
    google_auth_qr: string;
    otpauth_url: string;
}

interface OTP{
    secret?: SecretObjectInterface | GeneratedSecret;
}

declare module 'express-session' {
    interface SessionData extends OTP {
        userData : userInterface | undefined,
    }
}

