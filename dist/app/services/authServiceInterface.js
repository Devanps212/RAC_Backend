"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceAuthService = void 0;
const interfaceAuthService = (service) => {
    const encryptPassword = (password) => {
        return service.encryption(password);
    };
    const decryptPassword = (password, hashPassword) => {
        return service.decryption(password, hashPassword);
    };
    const jwtGeneration = (payload, role) => {
        return service.jwtGeneration({ payload, role });
    };
    const tokenVerification = (token) => {
        return service.verifyToken(token);
    };
    return {
        encryptPassword,
        decryptPassword,
        jwtGeneration,
        tokenVerification
    };
};
exports.interfaceAuthService = interfaceAuthService;
