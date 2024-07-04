"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminUser_1 = require("../../app/use_case/adminUser/adminUser");
const booking_1 = require("../../app/use_case/booking/booking");
const httpTypes_1 = require("../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const adminUserController = (userModel, userInterface, userRepository, bookingInterface, bookingRepository, bookingModel) => {
    const userService = userInterface(userRepository(userModel));
    const bookingService = bookingInterface(bookingRepository(bookingModel));
    const getAllUsers = (0, express_async_handler_1.default)(async (req, res) => {
        const users = await (0, adminUser_1.getAllUser)(userService);
        res.json({
            status: "success",
            message: "successfully retrieved",
            users,
        });
    });
    const unblockBlockUser = (0, express_async_handler_1.default)(async (req, res) => {
        const userId = req.headers['x-user-id'];
        const data = {
            userId: userId
        };
        const bookings = await (0, booking_1.bookingBasedOnRole)(data, bookingService);
        const hasBookingOngoing = Array.isArray(bookings)
            ? bookings.some((booking) => booking.status === 'Confirmed')
            : bookings?.status === 'Confirmed';
        if (hasBookingOngoing) {
            throw new appErrors_1.default('User has an ongoing booking', httpTypes_1.HttpStatus.CONFLICT);
        }
        else {
            await (0, adminUser_1.blockUnblockUser)(userId, userService);
            res.json({
                status: 'success',
            });
        }
    });
    const findOneuser = (0, express_async_handler_1.default)(async (req, res) => {
        const userId = req.header('x-user-id');
        const user = await (0, adminUser_1.findOneUser)(userId, userService);
        res.json({
            status: "success",
            user
        });
    });
    return {
        getAllUsers,
        unblockBlockUser,
        findOneuser
    };
};
exports.default = adminUserController;
