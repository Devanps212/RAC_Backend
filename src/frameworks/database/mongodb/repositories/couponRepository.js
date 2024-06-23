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
exports.couponRepository = void 0;
const coupon_1 = __importDefault(require("../../../../entities/coupon"));
const couponRepository = (model) => {
    const couponEntity = new coupon_1.default(model);
    const generateCoupon = (price, expiry) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponEntity.generateCoupon(price, expiry);
        return response;
    });
    const confirmCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponEntity.verifyCoupon(couponId);
        return response;
    });
    const findCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponEntity.findCoupon(data);
        return response;
    });
    const updateCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponEntity.editCoupon(data);
        return response;
    });
    const findAllCoupon = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponEntity.findAllCoupon();
        return response;
    });
    const deleteCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield couponEntity;
        return response;
    });
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
