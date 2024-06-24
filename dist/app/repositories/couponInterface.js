"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const couponInterface = (couponRepository) => {
    const generateCoupon = async (price, expiry) => {
        const response = await couponRepository.generateCoupon(price, expiry);
        return response;
    };
    const verifyCoupon = async (couponId) => {
        const response = await couponRepository.confirmCoupon(couponId);
        return response;
    };
    const findCoupon = async (data) => {
        const response = await couponRepository.findCoupon(data);
        return response;
    };
    const updateCoupon = async (data) => {
        const response = await couponRepository.updateCoupon(data);
        return response;
    };
    const findAllCoupon = async () => {
        const response = await couponRepository.findAllCoupon();
        return response;
    };
    return {
        generateCoupon,
        verifyCoupon,
        findCoupon,
        updateCoupon,
        findAllCoupon
    };
};
exports.default = couponInterface;
