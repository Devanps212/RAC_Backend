"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAuthMiddleware = exports.authentication = void 0;
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const authServices_1 = require("../../services/authServices");
const authentication = (req, res, next) => {
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
        console.log("user not authorized");
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const { role } = (0, authServices_1.authService)().decodeToken(token);
    if (role !== 'partner' && role !== 'admin' && role !== 'user') {
        console.log("not partner not admin nor user");
        throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    let customReq = req;
    customReq.role = role;
    next();
};
exports.authentication = authentication;
const RoleAuthMiddleware = (roleOrRoles) => {
    return (req, res, next) => {
        const customReq = req;
        const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
        if (!roles.includes(customReq.role)) {
            console.log('Not expected role');
            throw new appErrors_1.default('User is not authorized', httpTypes_1.HttpStatus.UNAUTHORIZED);
        }
        next();
    };
};
exports.RoleAuthMiddleware = RoleAuthMiddleware;
