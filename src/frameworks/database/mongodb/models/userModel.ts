import mongoose, { Schema, Types } from "mongoose";


const transactionSchema = new mongoose.Schema({
    transactionID: {type:String, required: true},
    amount: {type:Number , required: true},
    purpose:{type:String, required: true}
})

const couponSchema = new mongoose.Schema({
    coupon: { type: String, required: true },
    discountData: {
        amount: { type: Number, required: true },
        percentage: { type: String, required: true }
    },
    price: { type: Number, required: true },
    ApplyPrice: {
        minApply: { type: Number, required: true },
        maxApply: { type: Number, required: true }
    },
    expiry: { type: Date, required: true },
    active: { type: Boolean, required: true },
    couponUsed: { type: Boolean }
});

const refundModel = new Schema({
    Amount : {type: Number, required: true},
    paymentId: {type: String, required: true}
}, {timestamps:true})


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
    city:{
        type:String
    },
    DOB:{
        type:Date,
    },
    address:{
        type:String
    },
    gender:{
        type: String
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
    },
    refund:{
        type: [refundModel],
        default:[]
    }, 
    coupons: { type: [couponSchema], default: [] }
}, {timestamps: true})

export const usersModel = mongoose.model('User', userSchema)
export type userModelType = typeof usersModel