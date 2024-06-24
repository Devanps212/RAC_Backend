"use strict";
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
    const adminLogin = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, password } = req?.body;
        const admin = await (0, adminAuth_1.loginAdmin)(email, password, adminRepoInteface, adminAuth);
        const payload = admin._id ? admin._id.toString() : '';
        const token = await adminAuth.jwtGeneration(payload, 'admin');
        res.json({
            status: "success",
            message: "Admin Login Success",
            token
        });
    });
    const findAdminOne = (0, express_async_handler_1.default)(async (req, res) => {
        const adminId = req.query.adminId;
        const admin = await (0, adminAuth_1.findOneAdmin)(String(adminId), adminRepoInteface);
        res.json({
            data: admin,
            status: "success"
        });
    });
    const adminUpdate = (0, express_async_handler_1.default)(async (req, res) => {
        let data = req.body;
        if (req.files) {
            const files = req.files;
            if (files.profilePic && Array.isArray(files.profilePic) && files.profilePic.length > 0) {
                const filePath = files.profilePic[0].path;
                data.profilePic = filePath;
            }
        }
        const update = await (0, adminAuth_1.updateAdmin)(data, adminRepoInteface);
        res.json({
            data: update,
            status: "success"
        });
    });
    return {
        adminLogin,
        findAdminOne,
        adminUpdate
    };
};
exports.adminAuthController = adminAuthController;
