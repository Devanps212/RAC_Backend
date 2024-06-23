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
    const partnersLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { formData } = req === null || req === void 0 ? void 0 : req.body;
        const { email, password } = formData;
        if (email && password) {
            const partner = yield (0, partnerUseCase_1.partnerLogin)(email, password, partnerService, authServices);
            const payload = (partner === null || partner === void 0 ? void 0 : partner._id) ? partner._id.toString() : '';
            const token = yield authServices.jwtGeneration(payload, 'partner');
            res.json({
                status: "success",
                message: "successfully logged in",
                token
            });
        }
    }));
    const signUpPartner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { partnerData } = req.body;
        const payload = yield authServices.tokenVerification(partnerData.token);
        let partnerId = '';
        if (typeof payload === 'object' && 'payload' in payload) {
            partnerId = payload.payload;
        }
        const userExists = yield (0, userAuth_1.checkUserExists)(partnerId, userServices);
        const partnerExists = yield (0, partnerUseCase_2.partnerExist)(partnerId, partnerService);
        if (partnerExists === null && userExists) {
            partnerData.email = userExists.email;
            partnerData.userId = (_a = userExists._id) === null || _a === void 0 ? void 0 : _a.toString();
            const paymentStarts = yield (0, partnerUseCase_2.signUpPayment)(partnerData, paymentServices);
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
    }));
    const transactionHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const transactionId = req.params.transactionId;
        const partnerId = req.params.userId;
        const partner = yield (0, partnerUseCase_1.partnerSignUp)(partnerId, transactionId, partnerService);
        res.redirect(`http://localhost:5173/partner/success/${transactionId}/${partnerId}`);
    }));
    const partnerFindAll = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const partners = yield (0, partnerUseCase_1.findAllPartner)(partnerService);
        res.json({
            data: partners,
            status: 'success'
        });
    }));
    const findOnePartner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.query;
        const partnerId = id;
        const findPartner = yield (0, partnerUseCase_2.partnerExist)(partnerId, partnerService);
        if (!findPartner) {
            throw new appErrors_1.default('no partner found', httpTypes_1.HttpStatus.NO_CONTENT);
        }
        res.json(findPartner);
    }));
    const findUsersConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.query.userId;
        const findUsers = yield (0, user_1.findUsersForConversation)(String(userId), userServices);
        res.json({
            data: findUsers,
            status: 'success'
        });
    }));
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
