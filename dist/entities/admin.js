"use strict";
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
    async createAdmin(adminData) {
        const admin = await this.model.create(adminData);
        return admin;
    }
    async getAdminByEmail(email) {
        const adminData = await this.model.findOne({ email });
        return adminData;
    }
    async findOneAdmin(id) {
        const admin = await this.model.findOne({ _id: id });
        if (!admin) {
            throw new appErrors_1.default('Admin not found', httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log("Admin : ", admin);
        return admin;
    }
    async updateAdmin(data) {
        try {
            console.log("admin Data : ", data);
            if (Object.keys(data).length === 0) {
                throw new appErrors_1.default('Provide something to update Admin', httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
            }
            console.log("updating");
            const admin = await this.model.findOne({ _id: data._id });
            console.log("admin : ", admin);
            if (!admin) {
                throw new appErrors_1.default('No admin found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            Object.assign(admin, data);
            const saveAdmin = await admin.save();
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
    }
}
exports.adminEntity = adminEntity;
