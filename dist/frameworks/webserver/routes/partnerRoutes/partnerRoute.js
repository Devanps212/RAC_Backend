"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const partnerRepoInterface_1 = require("../../../../app/repositories/partnerRepoInterface");
const partnerRepository_1 = require("../../../database/mongodb/repositories/partnerRepository");
const authServices_1 = require("../../../services/authServices");
const authServiceInterface_1 = require("../../../../app/services/authServiceInterface");
const partnerController_1 = __importDefault(require("../../../../adapter/controllers/partnerController"));
const paymentService_1 = require("../../../services/paymentService");
const paymentInterface_1 = require("../../../../app/services/paymentInterface");
const userDbrepository_1 = require("../../../../app/repositories/userDbrepository");
const userRepositoryMongo_1 = require("../../../database/mongodb/repositories/userRepositoryMongo");
const userModel_1 = require("../../../database/mongodb/models/userModel");
const partnerAuthMiddleware_1 = require("../../middlewares/partnerAuthMiddleware");
const partnerRoute = () => {
    const controller = (0, partnerController_1.default)(partnerRepository_1.partnerDbRepo, partnerRepoInterface_1.partnerRepoInterface, authServices_1.authService, authServiceInterface_1.interfaceAuthService, paymentInterface_1.paymentInterface, paymentService_1.paymentService, userDbrepository_1.userdbRepository, userRepositoryMongo_1.userRepository, userModel_1.usersModel);
    const router = express_1.default.Router();
    router.post('/login', controller.partnersLogin);
    router.post('/signUp', controller.signUpPartner);
    router.get('/getUserForConversation', partnerAuthMiddleware_1.PartnerAuthentication, controller.findUsersConversation);
    router.get('/redirect-to/:transactionId/:userId', controller.transactionHandler);
    router.get('/All', controller.partnerFindAll);
    router.get('/findOne', controller.findOnePartner);
    return router;
};
exports.default = partnerRoute;
