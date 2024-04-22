import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    transactionID: {type:String, required: true},
    amount: {type:Number , required: true},
    purpose:{type:String, required: true}
})


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
    },
    isGoogleUser:{
        type:Boolean,
        default:false
    },
    isPartner:{
        type: Boolean,
        default: false
    },
    transactions:{
        type: [transactionSchema]
    }

})

export const usersModel = mongoose.model('User', userSchema)
export type userModelType = typeof usersModel