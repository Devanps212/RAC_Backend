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
exports.protectRoute = void 0;
const authServiceInterface_1 = require("../../../app/services/authServiceInterface");
const authServices_1 = require("../../services/authServices");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const authServices = (0, authServiceInterface_1.interfaceAuthService)((0, authServices_1.authService)());
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("reached protect route");
        let token = req.body.userId;
        console.log("token found on body : ", token);
        let attachedBody = true;
        if (!token) {
            token = req.params.senderId;
            console.log("token found on params : ", token);
            attachedBody = false;
        }
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
                console.log("token found on header : ", token);
                attachedBody = true;
            }
        }
        if (!token) {
            throw new appErrors_1.default("No token found", httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        const verifyToken = yield authServices.tokenVerification(token);
        if (!verifyToken) {
            throw new appErrors_1.default("Invalid token", httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        if (typeof verifyToken === 'object' && 'payload' in verifyToken) {
            if (attachedBody) {
                console.log("id attached to Body");
                req.body.userId = verifyToken.payload;
            }
            else {
                console.log("id attached to params");
                req.params.senderId = verifyToken.payload;
            }
        }
        else {
            throw new appErrors_1.default('Invalid Token', httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        console.log("payload found: ", verifyToken.payload);
        next();
    }
    catch (error) {
        next(new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
    }
});
exports.protectRoute = protectRoute;
