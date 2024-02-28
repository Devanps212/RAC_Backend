import { Types } from "mongoose"

export interface createAdminInterface {
    _id:Types.ObjectId,
    name:string,
    email:string,
    profilePic?: string | null | undefined;
    password:string
}

export interface adminInterface {
    name?:string,
    email:string,
    password:string
}