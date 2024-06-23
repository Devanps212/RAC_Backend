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
exports.findAllPartner = exports.partnerSignUp = exports.partnerLogin = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const partnerLogin = (email, password, partnerInterface, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield partnerInterface.partnerLogin(email);
    console.log("userData: ", user);
    if (user) {
        if (user.isGoogleUser) {
            return user;
        }
        else if (user.password) {
            const checkPassword = yield authService.decryptPassword(password, user.password);
            console.log("password check: ", checkPassword);
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
});
exports.partnerLogin = partnerLogin;
const partnerSignUp = (userId, transactionId, partnerInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = 250;
    const purpose = 'signUp';
    const partner = yield partnerInterface.partnerExist(userId);
    if (partner !== null) {
        console.log("partner exist : ", partner);
        throw new appErrors_1.default('Partner is already exist', httpTypes_1.HttpStatus.CONFLICT);
    }
    console.log("creating signUp");
    const partnerSignUp = yield partnerInterface.partnerSignup(userId, transactionId, purpose, amount);
    if (partnerSignUp === null) {
        console.log("Partner creation failed");
        throw new appErrors_1.default("Partner creation failed", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return partnerSignUp;
});
exports.partnerSignUp = partnerSignUp;
const findAllPartner = (partnerInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield partnerInterface.findPartner();
    return response;
});
exports.findAllPartner = findAllPartner;
