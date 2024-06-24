"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRepository = void 0;
const conversation_1 = require("../../../../entities/conversation");
const conversationRepository = (model) => {
    const chatEntity = new conversation_1.conversationEntity(model);
    const setParticipants = async (data) => {
        const response = await chatEntity.createConversation(data);
        return response;
    };
    const saveMessage = async (messageId, conversationId) => {
        const response = await chatEntity.MessageAdd(messageId, conversationId);
        return response;
    };
    const findMessage = async (oppositeUserId, senderId) => {
        const response = await chatEntity.getMessage(oppositeUserId, senderId);
        return response;
    };
    return {
        setParticipants,
        saveMessage,
        findMessage
    };
};
exports.conversationRepository = conversationRepository;
