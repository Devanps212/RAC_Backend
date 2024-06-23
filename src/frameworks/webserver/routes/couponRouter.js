"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRoute = void 0;
const express_1 = __importDefault(require("express"));
const couponController_1 = __importDefault(require("../../../adapter/controllers/couponController"));
const couponInterface_1 = __importDefault(require("../../../app/repositories/couponInterface"));
const couponRepository_1 = require("../../database/mongodb/repositories/couponRepository");
const couponModel_1 = require("../../database/mongodb/models/couponModel");
const userDbrepository_1 = require("../../../app/repositories/userDbrepository");
const userRepositoryMongo_1 = require("../../database/mongodb/repositories/userRepositoryMongo");
const userModel_1 = require("../../database/mongodb/models/userModel");
const couponRoute = () => {
    const route = express_1.default.Router();
    const controller = (0, couponController_1.default)(couponInterface_1.default, couponRepository_1.couponRepository, couponModel_1.couponModel, userDbrepository_1.userdbRepository, userRepositoryMongo_1.userRepository, userModel_1.usersModel);
    route.post('/Generate', controller.generateCoupon);
    route.get('/findAll', controller.findAllCoupons);
    route.patch('/updateCoupon', controller.updateCoupons);
    route.post('/applyCoupon', controller.couponApply);
    // route.get('/userCoupon', controller.findUserCoupon)
    return route;
};
exports.couponRoute = couponRoute;
