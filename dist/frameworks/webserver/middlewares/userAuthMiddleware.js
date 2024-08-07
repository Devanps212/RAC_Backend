"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthentication = void 0;
const authServices_1 = require("../../services/authServices");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const UserAuthentication = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        console.log("no header found");
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.substring(7);
    console.log("token found :", token);
    if (!token) {
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const verifyTokens = (0, authServices_1.authService)().verifyToken(token);
    console.log("token :", verifyTokens);
    if (!verifyTokens) {
        console.log("user not authorized");
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    console.log("token verified");
    const { role } = (0, authServices_1.authService)().decodeToken(token);
    console.log("role :", role);
    if (role !== 'user') {
        console.log("not user");
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    next();
};
exports.UserAuthentication = UserAuthentication;
