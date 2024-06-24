"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../../database/mongodb/models/userModel");
const userDbrepository_1 = require("../../../app/repositories/userDbrepository");
const userRepositoryMongo_1 = require("../../database/mongodb/repositories/userRepositoryMongo");
const adminUserController_1 = __importDefault(require("../../../adapter/controllers/adminUserController"));
const authenticationMidddleware_1 = require("../middlewares/authenticationMidddleware");
const authenticationMidddleware_2 = require("../middlewares/authenticationMidddleware");
const express_1 = __importDefault(require("express"));
const adminMiddleware = (0, authenticationMidddleware_2.RoleAuthMiddleware)('admin');
const adminUserRouter = () => {
    const controllers = (0, adminUserController_1.default)(userModel_1.usersModel, userDbrepository_1.userdbRepository, userRepositoryMongo_1.userRepository);
    const userAdminRouter = express_1.default.Router();
    userAdminRouter.get('/allUsers', authenticationMidddleware_1.authentication, adminMiddleware, controllers.getAllUsers);
    userAdminRouter.patch('/UBUser', authenticationMidddleware_1.authentication, adminMiddleware, controllers.unblockBlockUser);
    userAdminRouter.get('/userFind', authenticationMidddleware_1.authentication, adminMiddleware, controllers.findOneuser);
    return userAdminRouter;
};
exports.default = adminUserRouter;
