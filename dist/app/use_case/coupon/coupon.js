"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCoupon = exports.updateCoupon = exports.findCoupon = exports.verifyCoupon = exports.generatingCoupon = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const generatingCoupon = async (price, expiryDate, couponService) => {
    const response = await couponService.generateCoupon(price, expiryDate);
    return response;
};
exports.generatingCoupon = generatingCoupon;
const verifyCoupon = async (couponId, couponService) => {
    const response = await couponService.verifyCoupon(couponId);
    return response;
};
exports.verifyCoupon = verifyCoupon;
const findCoupon = async (data, couponService) => {
    try {
        const response = await couponService.findCoupon(data);
        if (!Array.isArray(response)) {
            if (!response.active) {
                throw new appErrors_1.default('cannot apply coupon , it is removed', httpTypes_1.HttpStatus.NOT_ACCEPTABLE);
            }
            else {
                return response;
            }
        }
        return response;
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.findCoupon = findCoupon;
const updateCoupon = async (data, couponService) => {
    const response = await couponService.updateCoupon(data);
    return response;
};
exports.updateCoupon = updateCoupon;
const findAllCoupon = async (couponService) => {
    const response = await couponService.findAllCoupon();
    return response;
};
exports.findAllCoupon = findAllCoupon;
