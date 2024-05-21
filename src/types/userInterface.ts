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
    city?:string
    profilePic?:string,
    isActive?:boolean,
    isGoogleUser?:boolean,
    address?:string,
    amount?:number,
    role?:string
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
        userData : string | null,
    }
}

