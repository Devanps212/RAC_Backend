"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    transactionID: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true }
});
const couponSchema = new mongoose_1.default.Schema({
    coupon: { type: String, required: true },
    discountData: {
        amount: { type: Number, required: true },
        percentage: { type: String, required: true }
    },
    price: { type: Number, required: true },
    ApplyPrice: {
        minApply: { type: Number, required: true },
        maxApply: { type: Number, required: true }
    },
    expiry: { type: Date, required: true },
    active: { type: Boolean, required: true },
    couponUsed: { type: Boolean }
});
const refundModel = new mongoose_1.Schema({
    Amount: { type: Number, required: true },
    paymentId: { type: String, required: true }
}, { timestamps: true });
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
    },
    password: {
        type: String,
    },
    profilePic: {
        type: String,
        default: ''
    },
    DL: {
        type: String,
        default: ''
    },
    city: {
        type: String
    },
    DOB: {
        type: Date,
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    isPartner: {
        type: Boolean,
        default: false
    },
    transactions: {
        type: [transactionSchema]
    },
    refund: {
        type: [refundModel],
        default: []
    },
    coupons: { type: [couponSchema], default: [] }
}, { timestamps: true });
exports.usersModel = mongoose_1.default.model('User', userSchema);
