"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerEntity = void 0;
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class partnerEntity {
    constructor(model) {
        this.model = model;
    }
    async partnerLogin(email) {
        try {
            const user = await this.model.findOne({ email: email, isPartner: true });
            if (!user) {
                throw new appErrors_1.default('User not found', httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            return user;
        }
        catch (error) {
            console.log(error.message);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async partnerExist(partnerId) {
        try {
            const partner = await this.model.findOne({ _id: partnerId, isPartner: true });
            return partner ? partner.toObject() : null;
        }
        catch (error) {
            console.log(error.message);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async partnerCreate(userId, transactionId, purpose, amount) {
        try {
            const newTransaction = {
                transactionID: transactionId,
                amount: amount,
                purpose: purpose
            };
            const partner = await this.model.updateOne({ _id: userId }, { $set: { isPartner: true }, $push: { transactions: newTransaction } });
            if (partner.matchedCount > 0 && partner.modifiedCount > 0) {
                return partner;
            }
            else {
                throw new appErrors_1.default("Failed to create partner. User not found or update unsuccessful", httpTypes_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllPartner() {
        try {
            const partners = await this.model.find({ isPartner: true });
            if (partners === null) {
                throw new appErrors_1.default("no partners Found", httpTypes_1.HttpStatus.NOT_FOUND);
            }
            return partners.map(partner => partner.toObject());
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.partnerEntity = partnerEntity;
