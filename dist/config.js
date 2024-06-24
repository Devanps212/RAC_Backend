"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configFile = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGODB_URL,
    JWT_KEY: process.env.JWT_SECRET,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASS: process.env.USER_EMAIL_PASS,
    SESSION_KEY: process.env.SESSION_ID,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_KEY: process.env.GOOGLE_CLIENT_SECRET,
    HOST_URL: process.env.HOST_URL,
    MERCHANT_ID: process.env.MERCHANT_ID,
    SALT_INDEX: process.env.SALT_INDEX,
    SALT_KEY: process.env.SALT_KEY,
    PHONEPAY_URL: process.env.PHONPAY_URL,
    LOCATION_ACCESS_TOKEN: process.env.LOCATION_ACCESS_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    ORIGIN_PORT: process.env.ORIGIN_PORT,
};
exports.default = configFile;
