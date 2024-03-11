import mongoose from "mongoose";


const partnerSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    mobile: {
        type:Number,
        default: null
    },
    password: {
        type:String,
    },
    profilePic:{
        type: String,
        default:''
    },
    DL: {
        type:String,
        default:''
    },
    DOB:{
        type:Date,
    },
    address:{
        type:[{
            country:{type:String},
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            phone: { type: String },
            alternateNumber: { type: String },
            landmark: { type: String },
        }],
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

export const partnersModel = mongoose.model('Partner', partnerSchema)
export type partnerModelType = typeof partnersModel