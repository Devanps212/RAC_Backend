"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepository = void 0;
const messageEntity_1 = require("../../../../entities/messageEntity");
const messageRepository = (model) => {
    const messageEntity = new messageEntity_1.MessagesEntity(model);
    const createMessage = async (data) => {
        const response = await messageEntity.createMessage(data);
        return response;
    };
    return {
        createMessage
    };
};
exports.messageRepository = messageRepository;
