import { couponInterface } from "../../../types/couponInetrface"
import { HttpStatus } from "../../../types/httpTypes"
import AppError from "../../../utils/appErrors"
import { couponInterfaceType } from "../../repositories/couponInterface"


export const generatingCoupon = async(price: number, expiryDate: string, couponService : ReturnType<couponInterfaceType> )=>{
    const response = await couponService.generateCoupon(price, expiryDate)
    return response
}

export const verifyCoupon = async(couponId: string, couponService: ReturnType<couponInterfaceType>)=>{
    const response = await couponService.verifyCoupon(couponId)
    return response
}

export const findCoupon = async(data: string, couponService: ReturnType<couponInterfaceType>)=>{
    try{
        const response : couponInterface[] | couponInterface = await couponService.findCoupon(data)
        if(!Array.isArray(response)){
            if(!response.active){
                throw new AppError('cannot apply coupon , it is removed', HttpStatus.NOT_ACCEPTABLE)
            } else {
                return response
            }
        }

        return response
    } catch(error: any){
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
}

export const updateCoupon = async(data: Partial<couponInterface>, couponService: ReturnType<couponInterfaceType>)=>{
    const response = await couponService.updateCoupon(data)
    return response
}

export const findAllCoupon = async(couponService: ReturnType<couponInterfaceType>)=>{
    const response = await couponService.findAllCoupon()
    return response
}