"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryController_1 = __importDefault(require("../../../adapter/controllers/categoryController"));
const categoryRepoInterface_1 = require("../../../app/repositories/categoryRepoInterface");
const categoryRepository_1 = require("../../database/mongodb/repositories/categoryRepository");
const categoryModel_1 = require("../../database/mongodb/models/categoryModel");
const authenticationMidddleware_1 = require("../middlewares/authenticationMidddleware");
const express_1 = __importDefault(require("express"));
const categoryRoute = () => {
    const AuthRoleMiddleware = (0, authenticationMidddleware_1.RoleAuthMiddleware)(['admin', 'partner']);
    const router = express_1.default.Router();
    const controller = (0, categoryController_1.default)(categoryRepoInterface_1.categoryRepoInterface, categoryRepository_1.categoryRepository, categoryModel_1.categoryModel);
    router.post('/createCateg', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.categoryCreation);
    router.put('/updateCateg', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.editsCategory);
    router.patch('/listCateg', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.list);
    router.patch('/unlistCateg', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.Unlist);
    router.get('/categoryOne', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.categoryRetrieve);
    router.get('/getCategoryAll', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.getAllCategory);
    router.put('/editCateg', authenticationMidddleware_1.authentication, AuthRoleMiddleware, controller.editsCategory);
    router.get('/findAllCategory', controller.getAllCategory);
    return router;
};
exports.default = categoryRoute;
