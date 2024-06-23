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
exports.partnerEntity = void 0;
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class partnerEntity {
    constructor(model) {
        this.model = model;
    }
    partnerLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ email: email, isPartner: true });
                if (!user) {
                    throw new appErrors_1.default('User not found', httpTypes_1.HttpStatus.UNAUTHORIZED);
                }
                return user;
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    partnerExist(partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partner = yield this.model.findOne({ _id: partnerId, isPartner: true });
                return partner ? partner.toObject() : null;
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    partnerCreate(userId, transactionId, purpose, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached partner entity ");
                const newTransaction = {
                    transactionID: transactionId,
                    amount: amount,
                    purpose: purpose
                };
                const partner = yield this.model.updateOne({ _id: userId }, { $set: { isPartner: true }, $push: { transactions: newTransaction } });
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
        });
    }
    findAllPartner() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partners = yield this.model.find({ isPartner: true });
                if (partners === null) {
                    throw new appErrors_1.default("no partners Found", httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return partners.map(partner => partner.toObject());
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.partnerEntity = partnerEntity;
