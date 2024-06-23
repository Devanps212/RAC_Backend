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
const adminUser_1 = require("../../app/use_case/adminUser/adminUser");
const adminUserController = (userModel, userInterface, userRepository) => {
    const userService = userInterface(userRepository(userModel));
    const getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, adminUser_1.getAllUser)(userService);
        res.json({
            status: "success",
            message: "successfully retrieved",
            users,
        });
    }));
    const unblockBlockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.headers['x-user-id'];
        try {
            yield (0, adminUser_1.blockUnblockUser)(userId, userService);
            res.json({
                status: 'success',
            });
        }
        catch (error) {
            console.log(error.message);
            throw new Error(error);
        }
    }));
    const findOneuser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.header('x-user-id');
        const user = yield (0, adminUser_1.findOneUser)(userId, userService);
        res.json({
            status: "success",
            user
        });
    }));
    return {
        getAllUsers,
        unblockBlockUser,
        findOneuser
    };
};
exports.default = adminUserController;
