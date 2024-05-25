export interface couponInterface {
    _id?:string,
    coupon: string,
    price:number,
    discountData:discountInterface,
    ApplyPrice:{
        minApply: number,
        maxApply: number
    },
    active: boolean,
    expiry: string | Date;
    couponUsed: boolean
}

export interface discountInterface {
    percentage: string,
    amount: number
}