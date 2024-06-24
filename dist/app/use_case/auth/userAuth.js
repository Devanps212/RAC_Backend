"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserByEmail = exports.AllMongoUsers = exports.findUser = exports.checkUserExists = exports.signIn_UpWithGoogle = exports.verifyOTP = exports.otpGenr = exports.loginUser = exports.signUp = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const otpServices_1 = require("../../../frameworks/services/otpServices");
const signUp = async (user, userRepository, authService) => {
    user.email = user.email.toLowerCase();
    console.log("User email : ", user.email);
    const existingUser = await userRepository.getUserByEmail(user.email);
    if (existingUser) {
        console.log("email already exist");
        throw new appErrors_1.default("Email already exists", httpTypes_1.HttpStatus.CONFLICT);
    }
    user.password = await authService.encryptPassword(user.password ?? "");
    const result = await userRepository.createUser(user);
    return result;
};
exports.signUp = signUp;
const loginUser = async (email, password, userRepository, authService) => {
    const user = await userRepository.getUserByEmail(email);
    console.log(user);
    console.log("user password : ", user?.password, password);
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
    const passCheck = await authService.decryptPassword(password, user.password ?? "");
    console.log("passCheck : ", passCheck);
    if (!passCheck) {
        console.log("password error");
        throw new appErrors_1.default("Password is wrong", httpTypes_1.HttpStatus.UNAUTHORIZED);
    }
    console.log(user);
    return user;
};
exports.loginUser = loginUser;
const otpGenr = async (email, userRepInterface, purpose) => {
    try {
        console.log("reached usecase");
        console.log(purpose);
        const { sendOtp } = (0, otpServices_1.otpAuth)();
        if (purpose == 'signin') {
            console.log("checking login");
            const checksUser = await userRepInterface.getUserByEmail(email);
            if (!checksUser) {
                throw new appErrors_1.default("User not found", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            const sendOTP = await sendOtp(email);
            console.log("send : ", sendOTP);
            return sendOTP;
        }
        else if (purpose == 'signup') {
            console.log("checking signUp");
            const checksUser = await userRepInterface.getUserByEmail(email);
            if (checksUser) {
                console.log("is user exist ? no");
                throw new appErrors_1.default("Email already used", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            const sendOTP = await sendOtp(email);
            console.log("send : ", sendOTP);
            return sendOTP;
        }
        else {
            console.log("checking user in FPOTP =========");
            const checksUser = await userRepInterface.getUserByEmail(email);
            const OTP = await sendOtp(email);
            return OTP;
        }
    }
    catch (error) {
        console.log("error message :", error);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
    }
};
exports.otpGenr = otpGenr;
const verifyOTP = async (otp, secret) => {
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
};
exports.verifyOTP = verifyOTP;
const signIn_UpWithGoogle = async (credentials, googleAuthInterface, userRepositoryInterface, authService) => {
    try {
        console.log("reached signin/signUp Google");
        const user = await googleAuthInterface.verify(credentials);
        console.log("user : ", user);
        const userExist = await userRepositoryInterface.getUserByEmail(user.email);
        if (userExist) {
            if (userExist.isActive) {
                console.log("UserSignIn starting");
                const payload = userExist?._id?.toString();
                console.log("payload for G signin : ", payload);
                const token = await authService.jwtGeneration(payload ?? '', 'user');
                console.log("new Token  :", token);
                return { purpose: "sigIn", message: "user SignIn success", token };
            }
            else {
                throw new appErrors_1.default(`User ${userExist.name} is blocked`, httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            console.log('user sigUp starting');
            const User = await userRepositoryInterface.createUser(user);
            console.log("new user created");
            const payload = User?._id?.toString();
            console.log("payload : ", payload);
            const token = await authService.jwtGeneration(payload ?? '', 'user');
            return { purpose: "sigIn", message: "user SignUp success", token };
        }
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
    }
};
exports.signIn_UpWithGoogle = signIn_UpWithGoogle;
const checkUserExists = async (userId, userRepository) => {
    try {
        const response = await userRepository.findOneUser(userId);
        return response;
    }
    catch (error) {
        console.log(error.message);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.checkUserExists = checkUserExists;
const findUser = async (userId, userRepository) => {
    try {
        const response = await userRepository.findUser(userId);
        return response;
    }
    catch (error) {
        console.log(error.message);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.findUser = findUser;
const AllMongoUsers = async (userRepository) => {
    const response = await userRepository.findMongoAllUsers();
    return response;
};
exports.AllMongoUsers = AllMongoUsers;
const checkUserByEmail = async (email, userRepository) => {
    const response = await userRepository.getUserByEmail(email);
    return response;
};
exports.checkUserByEmail = checkUserByEmail;
