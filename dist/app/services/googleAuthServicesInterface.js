"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthInterface = void 0;
const googleAuthInterface = (googleAuthService) => {
    const verify = async (token) => await googleAuthService.verify(token);
    console.log("verify : ", verify);
    return { verify };
};
exports.googleAuthInterface = googleAuthInterface;
