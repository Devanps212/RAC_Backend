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
exports.checkUserByEmail = exports.AllMongoUsers = exports.findUser = exports.checkUserExists = exports.signIn_UpWithGoogle = exports.verifyOTP = exports.otpGenr = exports.loginUser = exports.signUp = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const otpServices_1 = require("../../../frameworks/services/otpServices");
const signUp = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    user.email = user.email.toLowerCase();
    console.log("User email : ", user.email);
    const existingUser = yield userRepository.getUserByEmail(user.email);
    if (existingUser) {
        console.log("email already exist");
        throw new appErrors_1.default("Email already exists", httpTypes_1.HttpStatus.CONFLICT);
    }
    user.password = yield authService.encryptPassword((_a = user.password) !== null && _a !== void 0 ? _a : "");
    const result = yield userRepository.createUser(user);
    return result;
});
exports.signUp = signUp;
const loginUser = (email, password, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const user = yield userRepository.getUserByEmail(email);
    console.log(user);
    console.log("user password : ", user === null || user === void 0 ? void 0 : user.password, password);
    if (!user) {
        console.log("no user found");
        throw new appErrors_1.default("User not found", httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    if (!user.isActive) {
        throw new appErrors_1.default(`${user.name} is blocked`, httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    if (user.isGoogleUser) {
        console.log("google user found");
        throw new appErrors_1.default("this user is unauthorized", httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    const passCheck = yield authService.decryptPassword(password, (_b = user.password) !== null && _b !== void 0 ? _b : "");
    console.log("passCheck : ", passCheck);
    if (!passCheck) {
        console.log("password error");
        throw new appErrors_1.default("Password is wrong", httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    console.log(user);
    return user;
});
exports.loginUser = loginUser;
const otpGenr = (email, userRepInterface, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("reached usecase");
        console.log(purpose);
        const { sendOtp } = (0, otpServices_1.otpAuth)();
        if (purpose == 'signin') {
            console.log("checking login");
            const checksUser = yield userRepInterface.getUserByEmail(email);
            if (!checksUser) {
                throw new appErrors_1.default("User not found", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            const sendOTP = yield sendOtp(email);
            console.log("send : ", sendOTP);
            return sendOTP;
        }
        else if (purpose == 'signup') {
            console.log("checking signUp");
            const checksUser = yield userRepInterface.getUserByEmail(email);
            if (checksUser) {
                console.log("is user exist ? no");
                throw new appErrors_1.default("Email already used", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            const sendOTP = yield sendOtp(email);
            console.log("send : ", sendOTP);
            return sendOTP;
        }
        else {
            console.log("checking user in FPOTP =========");
            const checksUser = yield userRepInterface.getUserByEmail(email);
            const OTP = yield sendOtp(email);
            return OTP;
        }
    }
    catch (error) {
        console.log("error message :", error);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
    }
});
exports.otpGenr = otpGenr;
const verifyOTP = (otp, secret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("userAuth verifyOTP reached");
        if (secret) {
            console.log("user found");
            const { verifyOtp } = (0, otpServices_1.otpAuth)();
            const check = verifyOtp(otp, secret);
            console.log("currentOtp :", check);
            return check;
        }
        else {
            console.log("error no secret found");
            throw new appErrors_1.default("OTP error", httpTypes_1.HttpStatus.BAD_GATEWAY);
        }
    }
    catch (error) {
        throw new Error("Internal server error");
    }
});
exports.verifyOTP = verifyOTP;
const signIn_UpWithGoogle = (credentials, googleAuthInterface, userRepositoryInterface, authService) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        console.log("reached signin/signUp Google");
        const user = yield googleAuthInterface.verify(credentials);
        console.log("user : ", user);
        const userExist = yield userRepositoryInterface.getUserByEmail(user.email);
        if (userExist) {
            if (userExist.isActive) {
                console.log("UserSignIn starting");
                const payload = (_c = userExist === null || userExist === void 0 ? void 0 : userExist._id) === null || _c === void 0 ? void 0 : _c.toString();
                console.log("payload for G signin : ", payload);
                const token = yield authService.jwtGeneration(payload !== null && payload !== void 0 ? payload : '', 'user');
                console.log("new Token  :", token);
                return { purpose: "sigIn", message: "user SignIn success", token };
            }
            else {
                throw new appErrors_1.default(`User ${userExist.name} is blocked`, httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            console.log('user sigUp starting');
            const User = yield userRepositoryInterface.createUser(user);
            console.log("new user created");
            const payload = (_d = User === null || User === void 0 ? void 0 : User._id) === null || _d === void 0 ? void 0 : _d.toString();
            console.log("payload : ", payload);
            const token = yield authService.jwtGeneration(payload !== null && payload !== void 0 ? payload : '', 'user');
            return { purpose: "sigIn", message: "user SignUp success", token };
        }
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
    }
});
exports.signIn_UpWithGoogle = signIn_UpWithGoogle;
const checkUserExists = (userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userRepository.findOneUser(userId);
        return response;
    }
    catch (error) {
        console.log(error.message);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
exports.checkUserExists = checkUserExists;
const findUser = (userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userRepository.findUser(userId);
        return response;
    }
    catch (error) {
        console.log(error.message);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
exports.findUser = findUser;
const AllMongoUsers = (userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield userRepository.findMongoAllUsers();
    return response;
});
exports.AllMongoUsers = AllMongoUsers;
const checkUserByEmail = (email, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield userRepository.getUserByEmail(email);
    return response;
});
exports.checkUserByEmail = checkUserByEmail;
