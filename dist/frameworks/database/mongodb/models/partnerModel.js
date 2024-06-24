"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const partnerSchema = new mongoose_1.default.Schema({
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
        default: null
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
    DOB: {
        type: Date,
    },
    address: {
        type: [{
                country: { type: String },
                street: { type: String },
                city: { type: String },
                state: { type: String },
                pincode: { type: String },
                phone: { type: String },
                alternateNumber: { type: String },
                landmark: { type: String },
            }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});
exports.partnersModel = mongoose_1.default.model('Partner', partnerSchema);
