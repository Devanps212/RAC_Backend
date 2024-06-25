"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllPartner = exports.partnerSignUp = exports.partnerLogin = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const partnerLogin = async (email, password, partnerInterface, authService) => {
    const user = await partnerInterface.partnerLogin(email);
    if (user) {
        if (user.isGoogleUser) {
            return user;
        }
        else if (user.password) {
            const checkPassword = await authService.decryptPassword(password, user.password);
            if (checkPassword) {
                return user;
            }
            else {
                throw new appErrors_1.default('Incorrect password', httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new appErrors_1.default('Password not set for this user', httpTypes_1.HttpStatus.BAD_REQUEST);
        }
    }
    else {
        throw new appErrors_1.default('User not found', httpTypes_1.HttpStatus.NOT_FOUND);
    }
};
exports.partnerLogin = partnerLogin;
const partnerSignUp = async (userId, transactionId, partnerInterface) => {
    const amount = 250;
    const purpose = 'signUp';
    const partner = await partnerInterface.partnerExist(userId);
    if (partner !== null) {
        console.log("partner exist : ", partner);
        throw new appErrors_1.default('Partner is already exist', httpTypes_1.HttpStatus.CONFLICT);
    }
    const partnerSignUp = await partnerInterface.partnerSignup(userId, transactionId, purpose, amount);
    if (partnerSignUp === null) {
        console.log("Partner creation failed");
        throw new appErrors_1.default("Partner creation failed", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return partnerSignUp;
};
exports.partnerSignUp = partnerSignUp;
const findAllPartner = async (partnerInterface) => {
    const response = await partnerInterface.findPartner();
    return response;
};
exports.findAllPartner = findAllPartner;
