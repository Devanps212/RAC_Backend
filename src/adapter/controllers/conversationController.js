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
exports.conversationController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const conversation_1 = require("../../app/use_case/message/conversation");
const message_1 = require("../../app/use_case/message/message");
const conversationController = (conversationInterface, conversationRepository, conversationModel, authInterface, authRepository, messageInterface, messageRepository, messageModel) => {
    const conversationService = conversationInterface(conversationRepository(conversationModel));
    const messageServices = messageInterface(messageRepository(messageModel));
    const authService = authInterface(authRepository());
    const sendMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log("found controller");
            // console.log("req.jwt : ", req.body.message);
            const { Id } = req.params;
            const { message, senderId } = req.body;
            // console.log("params received from send Message", Id);
            const data = {
                message: message,
                senderId: senderId,
                recieverId: Id
            };
            const saveConversation = yield (0, conversation_1.sendMessage)(data, conversationService, authService);
            const newMessage = yield (0, message_1.createNewMessage)(data, messageServices);
            // console.log("newMessage : ", newMessage)
            // console.log("newMessage id : ", newMessage._id)
            const addMessageToConversation = yield (0, conversation_1.addMessage)(newMessage._id, saveConversation._id, conversationService);
            res.json(newMessage);
        }
        catch (error) {
            console.error("Error in sendMessages:", error);
        }
    }));
    const getMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { receiverId, senderId } = req.params;
        // console.log("receiverId : ", receiverId)
        // console.log("sebderId : ", senderId)
        const getMessage = yield (0, conversation_1.findMessage)(receiverId, senderId, conversationService);
        res.json(getMessage);
    }));
    return {
        sendMessages,
        getMessage
    };
};
exports.conversationController = conversationController;
exports.default = exports.conversationController;
