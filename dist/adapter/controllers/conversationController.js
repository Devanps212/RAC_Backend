"use strict";
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
    const sendMessages = (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const { Id } = req.params;
            const { message, senderId } = req.body;
            const data = {
                message: message,
                senderId: senderId,
                recieverId: Id
            };
            const saveConversation = await (0, conversation_1.sendMessage)(data, conversationService, authService);
            const newMessage = await (0, message_1.createNewMessage)(data, messageServices);
            const addMessageToConversation = await (0, conversation_1.addMessage)(newMessage._id, saveConversation._id, conversationService);
            res.json(newMessage);
        }
        catch (error) {
            console.error("Error in sendMessages:", error);
        }
    });
    const getMessage = (0, express_async_handler_1.default)(async (req, res) => {
        const { receiverId, senderId } = req.params;
        const getMessage = await (0, conversation_1.findMessage)(receiverId, senderId, conversationService);
        res.json(getMessage);
    });
    return {
        sendMessages,
        getMessage
    };
};
exports.conversationController = conversationController;
exports.default = exports.conversationController;
