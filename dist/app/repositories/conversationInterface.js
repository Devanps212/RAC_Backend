"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationInterfaces = void 0;
const conversationInterfaces = (conversationRepository) => {
    const setParticipants = async (data) => {
        const response = await conversationRepository.setParticipants(data);
        return response;
    };
    const addMessage = async (messageId, conversationId) => {
        const response = await conversationRepository.saveMessage(messageId, conversationId);
        return response;
    };
    const findMessage = async (oppositeUserId, senderId) => {
        const response = await conversationRepository.findMessage(oppositeUserId, senderId);
        return response;
    };
    return {
        setParticipants,
        addMessage,
        findMessage
    };
};
exports.conversationInterfaces = conversationInterfaces;
