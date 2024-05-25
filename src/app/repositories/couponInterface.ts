import { couponRepositoryType } from "../../frameworks/database/mongodb/repositories/couponRepository";
import { couponInterface } from "../../types/couponInetrface";

const couponInterface = (couponRepository: ReturnType<couponRepositoryType>) => {
    const generateCoupon = async (price: number, expiry: string) => {
        const response = await couponRepository.generateCoupon(price, expiry)
        return response;
    }

    const verifyCoupon = async(couponId: string)=>{
        const response = await couponRepository.confirmCoupon(couponId)
        return response
    }

    const findCoupon = async(data: string)=>{
        const response = await couponRepository.findCoupon(data)
        return response
    }

    const updateCoupon = async(data: Partial<couponInterface>)=>{
        const response = await couponRepository.updateCoupon(data)
        return response
    }

    const findAllCoupon = async()=>{
        const response = await couponRepository.findAllCoupon()
        return response
    }

    return {
        generateCoupon,
        verifyCoupon,
        findCoupon, 
        updateCoupon,
        findAllCoupon
    };
}

export default couponInterface;
export type couponInterfaceType = typeof couponInterface
