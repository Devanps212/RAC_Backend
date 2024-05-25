import { Types } from "mongoose";
import { couponModelType } from "../frameworks/database/mongodb/models/couponModel";
import { couponInterface, discountInterface } from "../types/couponInetrface";
import { HttpStatus } from "../types/httpTypes";
import AppError from "../utils/appErrors";

export class CouponEntity {
    private model: couponModelType;

    constructor(model: couponModelType) {
        this.model = model;
    }

    public async generateCoupon(price: number, expiry: string): Promise<couponInterface> {
        try {
            const existingDoc = await this.model.findOne({ 'ApplyPrice.minApply': price }).exec();
            if (existingDoc) {
                throw new AppError('Price is already used', HttpStatus.CONFLICT);
            }
    
            console.log("Reached generateCoupon");
            const couponCode = await this.generateCouponCode(price);
            const discount = this.calculateDiscount(price);
            const priceReduced = price - discount.amount;
            const expiryDate= new Date(expiry)


            console.log(priceReduced)
    
            console.log("Saving coupon...");
            const newCoupon = await this.model.create({
                coupon: couponCode,
                discountData: {
                    amount: priceReduced,
                    percentage: discount.percentage
                },
                price: (discount.amount * 10),
                ApplyPrice: {
                    minApply: price,
                    maxApply: price * 2
                },
                active: true,
                expiry: expiryDate
            });
    
            console.log("Coupon saved:", newCoupon);
    
            return newCoupon.toObject();
        } catch (error: any) {
            console.error("Failed to generate coupon:", error.message);
            throw new Error("Failed to generate coupon: " + error.message);
        }
    }
    
    private async generateCouponCode(price: number): Promise<string> {
        const baseCode = "SAVE";
        const discount = this.calculateDiscount(price);
        const randomChars = Math.random().toString(36).substr(2, 5).toUpperCase();
        const couponCode = `${baseCode}${discount.percentage}-${randomChars}`;
    
        const existingCoupon = await this.model.findOne({ coupon: couponCode });
        if (existingCoupon) {
            return this.generateCouponCode(price);
        }
    
        return couponCode;
    }
    
    private calculateDiscount(price: number): discountInterface {
        let amount: number;
        let percentage: string;
    
        if (price < 10000) {
            amount = 500;
            percentage = ((amount / price) * 100).toFixed(2);
        } else if (price >= 10000 && price < 20000) {
            amount = price * 0.05;
            percentage = '5.00';
        } else {
            amount = price * 0.1;
            percentage = '10.00';
        }
    
        console.log(`Discount Amount: ${amount.toFixed(2)}`);
        console.log(`Discount Percentage: ${percentage}%`);
    
        return { percentage, amount };
    }

    public async verifyCoupon (couponId: string): Promise<couponInterface | {message: string}>{
        try{
            const coupon = await this.model.findOne({_id: couponId})
            if(coupon == null){
                return {message: "coupon is inValid"}
            }

            return coupon.toObject()

        }catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async findCoupon(data: string): Promise<couponInterface[] | couponInterface> {
        try {
            let query: { $or?: any[]; expiry?: any } = {};
    
            if (data !== 'all') {
                const objectIdQuery = this.isValidObjectId(data) ? [{ _id: new Types.ObjectId(data) }] : [];
    
                query.$or = [
                    ...objectIdQuery,
                    { coupon: data }
                ];
    
                const priceNumber = parseFloat(data);
                if (!isNaN(priceNumber)) {
                    query.$or.push(
                        { 'discountData.amount': priceNumber },
                        { priceReduced: priceNumber },
                        { 'ApplyPrice.minApply': priceNumber },
                        { 'ApplyPrice.maxApply': priceNumber }
                    );
                }
    
                if (data.toLowerCase() === 'true' || data.toLowerCase() === 'false') {
                    const booleanValue = data.toLowerCase() === 'true';
                    query.$or.push(
                        { active: booleanValue }
                    );
                }
            }
    
            // query.expiry = { $gte: new Date() };
            console.log("query: ", query);
    
            const allCoupon = await this.model.find(query);
            console.log("Found coupons: ", allCoupon);
            
            if (!allCoupon.length) {
                throw new AppError('No coupons found', HttpStatus.NOT_FOUND);
            }
    
            return allCoupon.map(coupon => coupon.toObject());
        } catch (error: any) {
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }
    

    public async editCoupon(data: Partial<couponInterface>): Promise<couponInterface> {
        try {
            console.log(data)
            const updatedCoupon = await this.model.findByIdAndUpdate(
                { _id: data._id },
                { $set: data },
                { new: true}
            )
    
            console.log("updated: ", updatedCoupon)
            if (!updatedCoupon) {
                throw new AppError('Coupon not found', HttpStatus.NOT_FOUND);
            }
    
            return updatedCoupon.toObject();
        } catch (error: any) {
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async findAllCoupon(): Promise<couponInterface[] | null>{
        try{
            const AllCoupons = await this.model.find()
            if(AllCoupons !== null){
                return AllCoupons.map(coupon=>coupon.toObject())
            }
            return null
        } catch(error: any){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}

export default CouponEntity;
