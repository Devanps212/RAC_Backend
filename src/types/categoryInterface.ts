import { Types } from "mongoose"

export interface categoryInterface {
    name:string
    description?:string | null | undefined
    isListed?:Boolean
    _id?:Types.ObjectId
}