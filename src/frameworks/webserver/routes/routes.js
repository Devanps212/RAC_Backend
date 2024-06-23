"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("./userAuth"));
const adminAuth_1 = require("./adminAuth");
const categoryRoute_1 = __importDefault(require("./categoryRoute"));
const carRouter_1 = require("./carRouter");
const adminUser_1 = __importDefault(require("./adminUser"));
const partnerRoute_1 = __importDefault(require("./partnerRoutes/partnerRoute"));
const bookingRoute_1 = require("./bookingRoute");
const couponRouter_1 = require("./couponRouter");
const conversationRoute_1 = __importDefault(require("./conversationRoute"));
// import messageRoute from "./messageRoute"
const routes = (app) => {
    const router = express_1.default.Router();
    app.use('/api/user-auth', (0, userAuth_1.default)());
    app.use('/api/admin-auth', (0, adminAuth_1.adminAuthentication)());
    app.use('/api/admin', (0, adminUser_1.default)());
    app.use('/api/category', (0, categoryRoute_1.default)());
    app.use('/api/cars', (0, carRouter_1.carRoute)());
    app.use('/api/coupon', (0, couponRouter_1.couponRoute)());
    app.use('/api/partner', (0, partnerRoute_1.default)());
    app.use('/api/booking', (0, bookingRoute_1.bookingRoute)());
    app.use('/api/messenger-conversation', (0, conversationRoute_1.default)());
    // app.use('/api/messenger-message', messageRoute())
};
exports.default = routes;
