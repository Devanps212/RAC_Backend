"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRepository = void 0;
const coupon_1 = __importDefault(require("../../../../entities/coupon"));
const couponRepository = (model) => {
    const couponEntity = new coupon_1.default(model);
    const generateCoupon = async (price, expiry) => {
        const response = await couponEntity.generateCoupon(price, expiry);
        return response;
    };
    const confirmCoupon = async (couponId) => {
        const response = await couponEntity.verifyCoupon(couponId);
        return response;
    };
    const findCoupon = async (data) => {
        const response = await couponEntity.findCoupon(data);
        return response;
    };
    const updateCoupon = async (data) => {
        const response = await couponEntity.editCoupon(data);
        return response;
    };
    const findAllCoupon = async () => {
        const response = await couponEntity.findAllCoupon();
        return response;
    };
    const deleteCoupon = async (couponId) => {
        const response = await couponEntity;
        return response;
    };
    return {
        generateCoupon,
        confirmCoupon,
        findCoupon,
        updateCoupon,
        findAllCoupon,
        deleteCoupon
    };
};
exports.couponRepository = couponRepository;
