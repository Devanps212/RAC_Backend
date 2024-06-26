"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const partnerUseCase_1 = require("../../app/use_case/auth/partnerUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const partnerUseCase_2 = require("../../app/use_case/partner/partnerUseCase");
const userAuth_1 = require("../../app/use_case/auth/userAuth");
const user_1 = require("../../app/use_case/user/user");
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
const partnerController = (partnerRepository, partnerInterface, authService, authServiceInterface, paymentInterface, paymentService, userInterface, userDbrepository, userModel) => {
    const partnerService = partnerInterface(partnerRepository(userModel));
    const authServices = authServiceInterface(authService());
    const paymentServices = paymentInterface(paymentService());
    const userServices = userInterface(userDbrepository(userModel));
    const partnersLogin = (0, express_async_handler_1.default)(async (req, res) => {
        const { formData } = req?.body;
        const { email, password } = formData;
        if (email && password) {
            const partner = await (0, partnerUseCase_1.partnerLogin)(email, password, partnerService, authServices);
            const payload = partner?._id ? partner._id.toString() : '';
            const token = await authServices.jwtGeneration(payload, 'partner');
            res.json({
                status: "success",
                message: "successfully logged in",
                token
            });
        }
    });
    const signUpPartner = (0, express_async_handler_1.default)(async (req, res) => {
        const { partnerData } = req.body;
        const payload = await authServices.tokenVerification(partnerData.token);
        let partnerId = '';
        if (typeof payload === 'object' && 'payload' in payload) {
            partnerId = payload.payload;
        }
        const userExists = await (0, userAuth_1.checkUserExists)(partnerId, userServices);
        const partnerExists = await (0, partnerUseCase_2.partnerExist)(partnerId, partnerService);
        if (partnerExists === null && userExists) {
            partnerData.email = userExists.email;
            partnerData.userId = userExists._id?.toString();
            const paymentStarts = await (0, partnerUseCase_2.signUpPayment)(partnerData, paymentServices);
            res.json({
                data: paymentStarts,
                message: "success",
            });
        }
        else {
            res.json({
                data: null,
                message: "Partner already exist"
            });
        }
    });
    const transactionHandler = (0, express_async_handler_1.default)(async (req, res) => {
        const transactionId = req.params.transactionId;
        const partnerId = req.params.userId;
        const partner = await (0, partnerUseCase_1.partnerSignUp)(partnerId, transactionId, partnerService);
        res.redirect(`${process.env.ENVIRONMENT === 'dev' ? process.env.LOCALHOST : process.env.DOMAIN_URI}partner/success/${transactionId}/${partnerId}`);
    });
    const partnerFindAll = (0, express_async_handler_1.default)(async (req, res) => {
        const partners = await (0, partnerUseCase_1.findAllPartner)(partnerService);
        res.json({
            data: partners,
            status: 'success'
        });
    });
    const findOnePartner = (0, express_async_handler_1.default)(async (req, res) => {
        const { id } = req.query;
        const partnerId = id;
        const findPartner = await (0, partnerUseCase_2.partnerExist)(partnerId, partnerService);
        if (!findPartner) {
            throw new appErrors_1.default('no partner found', httpTypes_1.HttpStatus.NO_CONTENT);
        }
        res.json(findPartner);
    });
    const findUsersConversation = (0, express_async_handler_1.default)(async (req, res) => {
        const userId = req.query.userId;
        const findUsers = await (0, user_1.findUsersForConversation)(String(userId), userServices);
        res.json({
            data: findUsers,
            status: 'success'
        });
    });
    return {
        partnersLogin,
        signUpPartner,
        transactionHandler,
        partnerFindAll,
        findOnePartner,
        findUsersConversation
    };
};
exports.default = partnerController;
