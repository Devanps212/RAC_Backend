import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    coupon: {
        type:String,
        required: true
    },
    discountData:{
        amount:{
            type: Number,
            required: true
        },
        percentage:{
            type: String,
            required: true
        }
    },
    price: {
        type:Number,
        required: true
    },
    ApplyPrice:{
        minApply :{
            type:Number,
            required: true
        },
        maxApply: {
            type: Number,
            required: true
        }
    },
    expiry:{
        type: Date,
        required: true
    }, 
    active: {
        type: Boolean,
        required: true
    },
    couponUsed:{
        type: Boolean,
    }
})

export const couponModel = mongoose.model('Coupon', couponSchema)
export type couponModelType = typeof couponModel