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
exports.adminAuthController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminAuth_1 = require("../../app/use_case/auth/adminAuth");
const adminAuthController = (adminRepositoryImpl, adminInterfaceDB, authServiceImpl, authInterface, adminModel) => {
    const adminRepoInteface = adminInterfaceDB(adminRepositoryImpl(adminModel));
    const adminAuth = authInterface(authServiceImpl());
    const adminLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req === null || req === void 0 ? void 0 : req.body;
        const admin = yield (0, adminAuth_1.loginAdmin)(email, password, adminRepoInteface, adminAuth);
        const payload = admin._id ? admin._id.toString() : '';
        const token = yield adminAuth.jwtGeneration(payload, 'admin');
        res.json({
            status: "success",
            message: "Admin Login Success",
            token
        });
    }));
    const findAdminOne = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const adminId = req.query.adminId;
        const admin = yield (0, adminAuth_1.findOneAdmin)(String(adminId), adminRepoInteface);
        res.json({
            data: admin,
            status: "success"
        });
    }));
    const adminUpdate = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let data = req.body;
        if (req.files) {
            const files = req.files;
            if (files.profilePic && Array.isArray(files.profilePic) && files.profilePic.length > 0) {
                const filePath = files.profilePic[0].path;
                data.profilePic = filePath;
            }
        }
        const update = yield (0, adminAuth_1.updateAdmin)(data, adminRepoInteface);
        res.json({
            data: update,
            status: "success"
        });
    }));
    return {
        adminLogin,
        findAdminOne,
        adminUpdate
    };
};
exports.adminAuthController = adminAuthController;
