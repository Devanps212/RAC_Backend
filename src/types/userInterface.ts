import { Types } from "mongoose"
import { GeneratedSecret } from 'speakeasy';

export interface userInterface {
    _id?: Types.ObjectId,
    name?:string,
    email?:string
    mobile?:number | undefined | null
    password?:string | null
    DL?:string,
    DOB?:Date,
    profilePic?:string,
    isActive?:boolean,
    isGoogleUser?:boolean,
    address?:Array<{
        country?: string | undefined;
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        phone?: string | undefined;
        alternateNumber?: string | undefined;
        landmark?: string | undefined;
    }>
}
export interface createUserInterface {
    name:string,
    email:string,
    mobile?:number,
    password?:string,

}

export interface userAdminInterface {
    _id: Types.ObjectId
    name:string,
    email:string,
    mobile:number | undefined,
    profilePic?:string | undefined,
    isActive?:boolean,
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

