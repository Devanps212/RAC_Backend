"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const authService = () => {
    const encryption = async (password) => {
        const salt = await bcrypt_1.default.genSalt(10);
        const passEncrypt = await bcrypt_1.default.hash(password, salt);
        return passEncrypt;
    };
    const decryption = async (password, hashPass) => {
        const passdcrypt = await bcrypt_1.default.compare(password, hashPass);
        return passdcrypt;
    };
    const jwtGeneration = (payload) => {
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.JWT_KEY, {
            expiresIn: "4d"
        });
        console.log("JWT token : ", token);
        return token;
    };
    const verifyToken = (token) => {
        console.log("verifying token");
        return jsonwebtoken_1.default.verify(token, config_1.default.JWT_KEY);
    };
    const decodeToken = (token) => {
        return jsonwebtoken_1.default.decode(token);
    };
    return {
        encryption,
        decryption,
        jwtGeneration,
        verifyToken,
        decodeToken
    };
};
exports.authService = authService;
