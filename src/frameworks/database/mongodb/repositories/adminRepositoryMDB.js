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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepositoryMDB = void 0;
const admin_1 = require("../../../../entities/admin");
const adminRepositoryMDB = (model) => {
    const AdminEntity = new admin_1.adminEntity(model);
    const createAdmin = (adminData) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield AdminEntity.createAdmin(adminData);
        return admin;
    });
    const getAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield AdminEntity.getAdminByEmail(email);
        return admin;
    });
    const findOneAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield AdminEntity.findOneAdmin(data);
        return response;
    });
    const updateAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data, "inrepository");
        const response = yield AdminEntity.updateAdmin(data);
        return response;
    });
    return { createAdmin,
        getAdminByEmail,
        findOneAdmin,
        updateAdmin
    };
};
exports.adminRepositoryMDB = adminRepositoryMDB;
