"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userAuth_1 = require("../../app/use_case/auth/userAuth");
const user_1 = require("../../app/use_case/user/user");
const authController = (authServiceImpl, authServiceInterface, userRepository, userDbRepoImpl, userModel, googleServiceImpl, googleAuthInterface) => {
    const dbrepositoryUser = userRepository(userDbRepoImpl(userModel));
    const authService = authServiceInterface(authServiceImpl());
    const googleAuthService = googleAuthInterface(googleServiceImpl());
    const userSignup = (0, express_async_handler_1.default)(async (req, res) => {
        const user = req?.body;
        const DBuser = await (0, userAuth_1.signUp)(user, dbrepositoryUser, authService);
        const userId = DBuser?._id?.toString() || '';
        const jwtGeneration = await authService.jwtGeneration(userId, 'user');
        res.json({
            status: "success",
            message: "User signUp successful",
            token: jwtGeneration
        });
    });
    const userLogin = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, password } = req.body;
        const checkUser = await (0, userAuth_1.loginUser)(email, password, dbrepositoryUser, authService);
        const payload = checkUser?._id ? checkUser._id.toString() : '';
        const token = await authService.jwtGeneration(payload, 'user');
        res.json({
            status: "success",
            message: "Login success",
            token
        });
    });
    const otpGenerate = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, password, purpose } = req?.body;
        try {
            if (email && password !== '') {
                const user = await (0, userAuth_1.loginUser)(email, password, dbrepositoryUser, authService);
                const userId = user._id;
                const sendOtp = await (0, userAuth_1.otpGenr)(email, dbrepositoryUser, 'signin');
                const OTP = sendOtp.otp;
                res.json({
                    status: 'success',
                    code: 200,
                    message: 'OTP generated successfully',
                    purpose: 'signin',
                    userId,
                    OTP,
                });
            }
            else if (email && password && purpose === '') {
                const sendOtp = await (0, userAuth_1.otpGenr)(email, dbrepositoryUser, 'signup');
                const OTP = sendOtp.otp;
                res.json({
                    status: 'success',
                    code: 200,
                    message: 'OTP generated successfully',
                    purpose: 'signup',
                    OTP,
                });
            }
            else {
                const user = await (0, userAuth_1.checkUserByEmail)(email, dbrepositoryUser);
                const sendOtp = await (0, userAuth_1.otpGenr)(email, dbrepositoryUser, 'FPOTP');
                const OTP = sendOtp.otp;
                res.json({
                    status: 'success',
                    code: 200,
                    message: 'OTP generated successfully',
                    purpose: 'signup',
                    OTP,
                    user
                });
            }
        }
        catch (error) {
            console.error("Error in OTP generation:", error.message, "statusCode :", error.statusCode);
            let statusCode = 500;
            let message = 'Internal Server Error';
            if (error.isOperational && error.statusCode) {
                console.log("error is optional");
                statusCode = error.statusCode;
                message = error.message;
            }
            res.status(statusCode).json({
                status: 'error',
                code: statusCode,
                message: message,
            });
        }
    });
    const signInUpWithGoogle = (0, express_async_handler_1.default)(async (req, res) => {
        const { credentials } = req.body;
        const signUpInGoogle = await (0, userAuth_1.signIn_UpWithGoogle)(credentials, googleAuthService, dbrepositoryUser, authService);
        if (signUpInGoogle.purpose == "sigIn") {
            res.json({
                status: "success",
                message: signUpInGoogle.message,
                token: signUpInGoogle.token,
            });
        }
        else {
            res.json({
                status: "success",
                message: signUpInGoogle.message,
                token: signUpInGoogle.token,
            });
        }
    });
    const locationFinders = (0, express_async_handler_1.default)(async (req, res) => {
        const locations = req.body.location;
        const location = await (0, user_1.locationFinder)(locations);
        res.json({
            data: location
        });
    });
    const findSingleUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { data } = req.query;
        const findOneUser = await (0, userAuth_1.findUser)(data, dbrepositoryUser);
        res.json({
            status: 'success',
            data: findOneUser
        });
    });
    const upDateDetail = (0, express_async_handler_1.default)(async (req, res) => {
        let data;
        if (req.files) {
            const files = req.files;
            const path = files.profilePic[0].path;
            data = {};
            data.profilePic = path;
            data._id = req.body._id;
        }
        else {
            console.log(req.body);
            data = req.body;
        }
        const updatingUser = await (0, user_1.updateUser)(data, dbrepositoryUser);
        res.json({
            status: 'success',
            data: updatingUser
        });
    });
    const MongoAllUsers = (0, express_async_handler_1.default)(async (req, res) => {
        const users = await (0, userAuth_1.AllMongoUsers)(dbrepositoryUser);
        res.json({
            data: users,
            status: 'success'
        });
    });
    const findUserBasedOnEmail = (0, express_async_handler_1.default)(async (req, res) => {
        const email = req.headers['x-user-email'];
        const userExist = await (0, userAuth_1.checkUserByEmail)(email, dbrepositoryUser);
        res.json({
            user: userExist,
            status: 'success'
        });
    });
    const resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
        const { password, userId } = req.body;
        const reset = await (0, user_1.passwordReset)(password, userId, authService, dbrepositoryUser);
        res.json({
            message: 'success fully updated password',
            status: "success"
        });
    });
    return {
        userLogin,
        userSignup,
        otpGenerate,
        upDateDetail,
        MongoAllUsers,
        resetPassword,
        findSingleUser,
        locationFinders,
        signInUpWithGoogle,
        findUserBasedOnEmail,
    };
};
exports.default = authController;
