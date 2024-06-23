"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCoupon = exports.updateCoupon = exports.findCoupon = exports.verifyCoupon = exports.generatingCoupon = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const generatingCoupon = (price, expiryDate, couponService) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield couponService.generateCoupon(price, expiryDate);
    return response;
});
exports.generatingCoupon = generatingCoupon;
const verifyCoupon = (couponId, couponService) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield couponService.verifyCoupon(couponId);
    return response;
});
exports.verifyCoupon = verifyCoupon;
const findCoupon = (data, couponService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield couponService.findCoupon(data);
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
});
exports.findCoupon = findCoupon;
const updateCoupon = (data, couponService) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield couponService.updateCoupon(data);
    return response;
});
exports.updateCoupon = updateCoupon;
const findAllCoupon = (couponService) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield couponService.findAllCoupon();
    return response;
});
exports.findAllCoupon = findAllCoupon;
