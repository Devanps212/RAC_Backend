"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversationInterface_1 = require("../../../app/repositories/conversationInterface");
const conversationRepository_1 = require("../../database/mongodb/repositories/conversationRepository");
const conversationModel_1 = require("../../database/mongodb/models/conversationModel");
const conversationController_1 = __importDefault(require("../../../adapter/controllers/conversationController"));
const authServiceInterface_1 = require("../../../app/services/authServiceInterface");
const authServices_1 = require("../../services/authServices");
const messanger_1 = require("../../../app/repositories/messanger");
const messageRepository_1 = require("../../database/mongodb/repositories/messageRepository");
const messageModel_1 = require("../../database/mongodb/models/messageModel");
const partnerUserProtectMiddleware_1 = require("../middlewares/partnerUserProtectMiddleware");
const conversationRoute = () => {
    const router = express_1.default.Router();
    const controller = (0, conversationController_1.default)(conversationInterface_1.conversationInterfaces, conversationRepository_1.conversationRepository, conversationModel_1.conversationModel, authServiceInterface_1.interfaceAuthService, authServices_1.authService, messanger_1.messageDbInterface, messageRepository_1.messageRepository, messageModel_1.MessageModel);
    router.post('/send/:Id', partnerUserProtectMiddleware_1.PartnerUserAuthentication, controller.sendMessages);
    router.get('/:receiverId/:senderId', partnerUserProtectMiddleware_1.PartnerUserAuthentication, controller.getMessage);
    return router;
};
exports.default = conversationRoute;
