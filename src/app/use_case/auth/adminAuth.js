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
exports.updateAdmin = exports.findOneAdmin = exports.loginAdmin = void 0;
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const loginAdmin = (email, password, adminDBinterface, adminAuthInterface) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminDBinterface.getAdminByEmail(email);
        if (!admin) {
            throw new appErrors_1.default('admin Not found', httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        console.log("admin exist");
        const passCheck = yield adminAuthInterface.decryptPassword(password, admin.password);
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
});
exports.loginAdmin = loginAdmin;
const findOneAdmin = (adminId, adminDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminDBinterface.findOneAdmin(adminId);
    return user;
});
exports.findOneAdmin = findOneAdmin;
const updateAdmin = (data, adminDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield adminDBinterface.updateAdmin(data);
    return user;
});
exports.updateAdmin = updateAdmin;
