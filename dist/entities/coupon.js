"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponEntity = void 0;
const mongoose_1 = require("mongoose");
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class CouponEntity {
    constructor(model) {
        this.discountThresholds = [
            { price: 1500, percentage: 5 },
            { price: 5000, percentage: 10 },
            { price: 10000, percentage: 15 },
            { price: 15000, percentage: 20 },
            { price: 20000, percentage: 25 },
            { price: 25000, percentage: 30 },
            { price: 30000, percentage: 35 },
            { price: 55000, percentage: 40 },
            { price: 65000, percentage: 45 },
            { price: 85000, percentage: 50 },
        ];
        this.model = model;
    }
    async generateCoupon(price, expiry) {
        try {
            const existingDoc = await this.model.findOne({ 'ApplyPrice.minApply': price }).exec();
            if (existingDoc) {
                throw new appErrors_1.default('Price is already used', httpTypes_1.HttpStatus.CONFLICT);
            }
            console.log("Reached generateCoupon");
            const couponCode = await this.generateCouponCode(price);
            const discount = this.calculateDiscount(price);
            const priceReduced = price - discount.amount;
            const expiryDate = new Date(expiry);
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
            return newCoupon.toObject();
        }
        catch (error) {
            throw new Error("Failed to generate coupon: " + error.message);
        }
    }
    async generateCouponCode(price) {
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
    calculateDiscount(price) {
        let applicablePercentage = 0;
        for (let i = 0; i < this.discountThresholds.length; i++) {
            if (price >= this.discountThresholds[i].price) {
                applicablePercentage = this.discountThresholds[i].percentage;
            }
            else {
                break;
            }
        }
        const amount = (price * applicablePercentage) / 100;
        const percentage = applicablePercentage.toFixed(2);
        return { percentage, amount };
    }
    async verifyCoupon(couponId) {
        try {
            const coupon = await this.model.findOne({ _id: couponId });
            if (coupon == null) {
                return { message: "coupon is inValid" };
            }
            return coupon.toObject();
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findCoupon(data) {
        try {
            let query = {};
            if (data !== 'all') {
                const objectIdQuery = this.isValidObjectId(data) ? [{ _id: new mongoose_1.Types.ObjectId(data) }] : [];
                query.$or = [
                    ...objectIdQuery,
                    { coupon: data }
                ];
                const priceNumber = parseFloat(data);
                if (!isNaN(priceNumber)) {
                    query.$or.push({ 'discountData.amount': priceNumber }, { priceReduced: priceNumber }, { 'ApplyPrice.minApply': priceNumber }, { 'ApplyPrice.maxApply': priceNumber });
                }
                if (data.toLowerCase() === 'true' || data.toLowerCase() === 'false') {
                    const booleanValue = data.toLowerCase() === 'true';
                    query.$or.push({ active: booleanValue });
                }
            }
            const allCoupon = await this.model.find(query);
            if (!allCoupon.length) {
                throw new appErrors_1.default('No coupons found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            return allCoupon.map(coupon => coupon.toObject());
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    isValidObjectId(id) {
        return mongoose_1.Types.ObjectId.isValid(id);
    }
    async editCoupon(data) {
        try {
            console.log(data);
            const updatedCoupon = await this.model.findByIdAndUpdate({ _id: data._id }, { $set: data }, { new: true });
            if (!updatedCoupon) {
                throw new appErrors_1.default('Coupon not found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            return updatedCoupon.toObject();
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllCoupon() {
        try {
            const AllCoupons = await this.model.find();
            if (AllCoupons !== null) {
                return AllCoupons.map(coupon => coupon.toObject());
            }
            return null;
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCoupon(id) {
        try {
            const deleteCoupon = await this.model.deleteOne({ _id: id });
            if (deleteCoupon.deletedCount === 0) {
                throw new appErrors_1.default('coupon deletion failed', httpTypes_1.HttpStatus.NOT_MODIFIED);
            }
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.CouponEntity = CouponEntity;
exports.default = CouponEntity;
