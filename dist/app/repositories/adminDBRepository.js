"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDBRepository = void 0;
const adminDBRepository = (repository) => {
    const getAdminByEmail = async (email) => {
        return await repository.getAdminByEmail(email);
    };
    const createAdmin = async (adminData) => {
        return await repository.createAdmin(adminData);
    };
    const findOneAdmin = async (data) => {
        const response = await repository.findOneAdmin(data);
        return response;
    };
    const updateAdmin = async (data) => {
        const response = await repository.updateAdmin(data);
        return response;
    };
    return { getAdminByEmail,
        createAdmin,
        findOneAdmin,
        updateAdmin
    };
};
exports.adminDBRepository = adminDBRepository;
