"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleDeleteExpiredCoupons = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const couponRepository_1 = require("../database/mongodb/repositories/couponRepository");
const couponModel_1 = require("../database/mongodb/models/couponModel");
const scheduleDeleteExpiredCoupons = () => {
    node_cron_1.default.schedule('0 0 * * *', async () => {
        try {
            const couponService = (0, couponRepository_1.couponRepository)(couponModel_1.couponModel);
            const now = new Date();
            const coupons = await couponService.findAllCoupon() || [];
            const expiredCoupons = coupons.filter(coupon => new Date(coupon.expiry) < now);
            for (const coupon of expiredCoupons) {
                await couponService.deleteCoupon(coupon._id);
            }
            console.log(`Deleted ${expiredCoupons.length} expired coupons`);
        }
        catch (error) {
            console.error('Error deleting expired coupons:', error);
            throw new Error('Failed to delete expired coupons');
        }
    });
};
exports.scheduleDeleteExpiredCoupons = scheduleDeleteExpiredCoupons;
