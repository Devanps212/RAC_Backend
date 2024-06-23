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
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRepository = void 0;
const conversation_1 = require("../../../../entities/conversation");
const conversationRepository = (model) => {
    const chatEntity = new conversation_1.conversationEntity(model);
    const setParticipants = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield chatEntity.createConversation(data);
        return response;
    });
    const saveMessage = (messageId, conversationId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield chatEntity.MessageAdd(messageId, conversationId);
        return response;
    });
    const findMessage = (oppositeUserId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield chatEntity.getMessage(oppositeUserId, senderId);
        return response;
    });
    return {
        setParticipants,
        saveMessage,
        findMessage
    };
};
exports.conversationRepository = conversationRepository;
