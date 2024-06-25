"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerUserAuthentication = void 0;
const authServices_1 = require("../../services/authServices");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const PartnerUserAuthentication = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.substring(7);
    if (!token) {
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const verifyTokens = (0, authServices_1.authService)().verifyToken(token);
    if (!verifyTokens) {
        console.log("User not authorized");
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const { role, payload } = (0, authServices_1.authService)().decodeToken(token);
    if (role !== 'partner' && role !== 'user') {
        console.log("Role is not partner or user");
        throw new appErrors_1.default('Partner is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    req.body.recieverId = payload;
    console.log("Authentication successful. Proceeding to next middleware...");
    next();
};
exports.PartnerUserAuthentication = PartnerUserAuthentication;
