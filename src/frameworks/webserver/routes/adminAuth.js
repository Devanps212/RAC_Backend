"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthentication = void 0;
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = require("../../../adapter/controllers/adminAuthController");
const authServices_1 = require("../../services/authServices");
const authServiceInterface_1 = require("../../../app/services/authServiceInterface");
const adminDBRepository_1 = require("../../../app/repositories/adminDBRepository");
const adminRepositoryMDB_1 = require("../../database/mongodb/repositories/adminRepositoryMDB");
const adminModel_1 = require("../../database/mongodb/models/adminModel");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const multerService_1 = __importDefault(require("../../../app/services/multerService"));
const adminAuthentication = () => {
    const router = express_1.default.Router();
    const controller = (0, adminAuthController_1.adminAuthController)(adminRepositoryMDB_1.adminRepositoryMDB, adminDBRepository_1.adminDBRepository, authServices_1.authService, authServiceInterface_1.interfaceAuthService, adminModel_1.adminsModel);
    router.post('/login', controller.adminLogin);
    router.get('/findOne', adminAuthMiddleware_1.AdminAuthentication, controller.findAdminOne);
    router.patch('/updateAdmin', adminAuthMiddleware_1.AdminAuthentication, multerService_1.default.fields([{ name: 'profilePic', maxCount: 1 }]), controller.adminUpdate);
    return router;
};
exports.adminAuthentication = adminAuthentication;
