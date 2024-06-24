"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepositoryMDB = void 0;
const admin_1 = require("../../../../entities/admin");
const adminRepositoryMDB = (model) => {
    const AdminEntity = new admin_1.adminEntity(model);
    const createAdmin = async (adminData) => {
        const admin = await AdminEntity.createAdmin(adminData);
        return admin;
    };
    const getAdminByEmail = async (email) => {
        const admin = await AdminEntity.getAdminByEmail(email);
        return admin;
    };
    const findOneAdmin = async (data) => {
        const response = await AdminEntity.findOneAdmin(data);
        return response;
    };
    const updateAdmin = async (data) => {
        console.log(data, "inrepository");
        const response = await AdminEntity.updateAdmin(data);
        return response;
    };
    return { createAdmin,
        getAdminByEmail,
        findOneAdmin,
        updateAdmin
    };
};
exports.adminRepositoryMDB = adminRepositoryMDB;
