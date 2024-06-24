"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminUser_1 = require("../../app/use_case/adminUser/adminUser");
const adminUserController = (userModel, userInterface, userRepository) => {
    const userService = userInterface(userRepository(userModel));
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
        try {
            await (0, adminUser_1.blockUnblockUser)(userId, userService);
            res.json({
                status: 'success',
            });
        }
        catch (error) {
            console.log(error.message);
            throw new Error(error);
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
