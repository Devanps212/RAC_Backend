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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const authService = () => {
    const encryption = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const passEncrypt = yield bcrypt_1.default.hash(password, salt);
        return passEncrypt;
    });
    const decryption = (password, hashPass) => __awaiter(void 0, void 0, void 0, function* () {
        const passdcrypt = yield bcrypt_1.default.compare(password, hashPass);
        return passdcrypt;
    });
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
