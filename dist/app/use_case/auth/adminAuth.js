"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdmin = exports.findOneAdmin = exports.loginAdmin = void 0;
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const loginAdmin = async (email, password, adminDBinterface, adminAuthInterface) => {
    try {
        const admin = await adminDBinterface.getAdminByEmail(email);
        if (!admin) {
            throw new appErrors_1.default('admin Not found', httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        console.log("admin exist");
        const passCheck = await adminAuthInterface.decryptPassword(password, admin.password);
        if (!passCheck) {
            throw new appErrors_1.default('Password is in correct', httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        console.log("admin password is correct");
        return admin;
    }
    catch (error) {
        console.log(error.message);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.loginAdmin = loginAdmin;
const findOneAdmin = async (adminId, adminDBinterface) => {
    const user = await adminDBinterface.findOneAdmin(adminId);
    return user;
};
exports.findOneAdmin = findOneAdmin;
const updateAdmin = async (data, adminDBinterface) => {
    const user = await adminDBinterface.updateAdmin(data);
    return user;
};
exports.updateAdmin = updateAdmin;
