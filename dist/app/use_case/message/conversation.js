"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMessage = exports.addMessage = exports.sendMessage = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const sendMessage = async (data, conversationInterface, authInterface) => {
    try {
        console.log("data :", data);
        if (!data.senderId) {
            console.log(data);
            throw new appErrors_1.default("token not found", httpTypes_1.HttpStatus.NOT_FOUND);
        }
        const response = await conversationInterface.setParticipants(data);
        return response;
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.sendMessage = sendMessage;
const addMessage = async (messageId, conversationId, conversationInterface) => {
    const response = await conversationInterface.addMessage(messageId, conversationId);
    return response;
};
exports.addMessage = addMessage;
const findMessage = async (oppositeUserId, senderId, conversationInterface) => {
    const response = await conversationInterface.findMessage(oppositeUserId, senderId);
    return response;
};
exports.findMessage = findMessage;
