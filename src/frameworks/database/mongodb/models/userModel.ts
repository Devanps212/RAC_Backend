import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
        required: true
    },
    password: {
        type:String,
        required: true
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
    },
    isGoogleUser:{
        type:Boolean,
        default:false
    }
})

export const usersModel = mongoose.model('User', userSchema)
export type userModelType = typeof usersModel