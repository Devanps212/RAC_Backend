"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    coupon: {
        type: String,
        required: true
    },
    discountData: {
        amount: {
            type: Number,
            required: true
        },
        percentage: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    ApplyPrice: {
        minApply: {
            type: Number,
            required: true
        },
        maxApply: {
            type: Number,
            required: true
        }
    },
    expiry: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    couponUsed: {
        type: Boolean,
    }
});
exports.couponModel = mongoose_1.default.model('Coupon', couponSchema);
