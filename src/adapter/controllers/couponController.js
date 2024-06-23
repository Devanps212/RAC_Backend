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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const coupon_1 = require("../../app/use_case/coupon/coupon");
const adminUser_1 = require("../../app/use_case/adminUser/adminUser");
const user_1 = require("../../app/use_case/user/user");
const couponController = (couponInterface, couponRepository, couponModel, userInterface, userRepository, userModel) => {
    const couponService = couponInterface(couponRepository(couponModel));
    const userService = userInterface(userRepository(userModel));
    const generateCoupon = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body.price;
        const expiryDate = req.body.expiry;
        const generate = yield (0, coupon_1.generatingCoupon)(data, expiryDate, couponService);
        res.json({
            data: generate,
            status: "success"
        });
    }));
    const updateCoupons = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = req.body;
        const update = yield (0, coupon_1.updateCoupon)(data, couponService);
        res.json({
            data: update,
            status: "success"
        });
    }));
    const findAllCoupons = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allCoupon = yield (0, coupon_1.findAllCoupon)(couponService);
        res.json({
            data: allCoupon,
            status: "success"
        });
    }));
    const couponApply = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { couponCode, userId } = req.body;
        const user = yield (0, adminUser_1.findOneUser)(userId, userService);
        const couponFind = yield (0, coupon_1.findCoupon)(couponCode, couponService);
        if (user !== null && user.coupons) {
            const updatedCoupons = user.coupons.map((c) => {
                if (c.coupon === couponCode) {
                    c.couponUsed = true,
                        c.active = false;
                }
                return c;
            });
            const updatedUser = Object.assign(Object.assign({}, user), { coupons: updatedCoupons });
            const update = yield (0, user_1.updateUser)(updatedUser, userService);
            res.json({
                data: updatedCoupons,
                status: "success"
            });
        }
        else {
            res.json({
                message: "no coupon found",
                status: "failed"
            });
        }
    }));
    return {
        generateCoupon,
        updateCoupons,
        findAllCoupons,
        couponApply,
    };
};
exports.default = couponController;
