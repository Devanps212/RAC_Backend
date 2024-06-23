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
exports.adminEntity = void 0;
const appErrors_1 = __importDefault(require("../utils/appErrors"));
const httpTypes_1 = require("../types/httpTypes");
class adminEntity {
    constructor(model) {
        this.model = model;
    }
    createAdmin(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.model.create(adminData);
            return admin;
        });
    }
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.model.findOne({ email });
            return adminData;
        });
    }
    findOneAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.model.findOne({ _id: id });
            if (!admin) {
                throw new appErrors_1.default('Admin not found', httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            console.log("Admin : ", admin);
            return admin;
        });
    }
    updateAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("admin Data : ", data);
                if (Object.keys(data).length === 0) {
                    throw new appErrors_1.default('Provide something to update Admin', httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
                }
                console.log("updating");
                const admin = yield this.model.findOne({ _id: data._id });
                console.log("admin : ", admin);
                if (!admin) {
                    throw new appErrors_1.default('No admin found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                Object.assign(admin, data);
                const saveAdmin = yield admin.save();
                console.log(saveAdmin);
                if (!saveAdmin) {
                    throw new appErrors_1.default('admin update failed', httpTypes_1.HttpStatus.NOT_MODIFIED);
                }
                console.log("saved admin : ", saveAdmin);
                return saveAdmin;
            }
            catch (error) {
                console.log(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.adminEntity = adminEntity;
