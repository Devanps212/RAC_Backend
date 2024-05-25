import CouponEntity from "../../../../entities/coupon"
import { couponInterface } from "../../../../types/couponInetrface"
import { couponModelType } from "../models/couponModel"


export const couponRepository = (model: couponModelType)=>{

    const couponEntity = new CouponEntity(model)

    const generateCoupon = async(price : number, expiry: string)=>{
        const response = await couponEntity.generateCoupon(price, expiry)
        return response
    }

    const confirmCoupon = async(couponId: string)=>{
        const response = await couponEntity.verifyCoupon(couponId)
        return response
    }

    const findCoupon = async(data: string)=>{
        const response = await couponEntity.findCoupon(data)
        return response
    }

    const updateCoupon = async(data: Partial<couponInterface>)=>{
        const response = await couponEntity.editCoupon(data)
        return response
    }

    const findAllCoupon = async()=>{
        const response = await couponEntity.findAllCoupon()
        return response
    }

    return{
        generateCoupon,
        confirmCoupon,
        findCoupon, 
        updateCoupon,
        findAllCoupon
    }
}

export type couponRepositoryType =typeof couponRepository