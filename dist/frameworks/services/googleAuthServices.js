"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthService = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.applicationDefault(),
    projectId: 'racars-c3cb8'
});
const googleAuthService = () => {
    try {
        console.log("reached google auth service");
        const verify = async (token) => {
            const user = {
                name: '',
                email: '',
                profilePic: '',
                isGoogleUser: true
            };
            console.log("token");
            console.log("ticket configuring");
            try {
                const result = await firebase_admin_1.default.auth().verifyIdToken(token);
                if (result) {
                    console.log("result : ", result);
                    if (result.name && result.email && result.picture) {
                        user.name = result.name,
                            user.email = result.email;
                        user.profilePic = result.picture;
                        console.log("user details fetched");
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
            }
            return user;
        };
        return { verify };
    }
    catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
};
exports.googleAuthService = googleAuthService;
