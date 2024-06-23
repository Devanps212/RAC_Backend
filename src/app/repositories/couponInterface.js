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
Object.defineProperty(exports, "__esModule", { value: true });
const couponInterface = (couponRepository) => {
    const generateCoupon = (price, expiry) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponRepository.generateCoupon(price, expiry);
        return response;
    });
    const verifyCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponRepository.confirmCoupon(couponId);
        return response;
    });
    const findCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponRepository.findCoupon(data);
        return response;
    });
    const updateCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponRepository.updateCoupon(data);
        return response;
    });
    const findAllCoupon = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponRepository.findAllCoupon();
        return response;
    });
    return {
        generateCoupon,
        verifyCoupon,
        findCoupon,
        updateCoupon,
        findAllCoupon
    };
};
exports.default = couponInterface;
