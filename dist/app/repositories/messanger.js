"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDbInterface = void 0;
const messageDbInterface = (repository) => {
    const createMessage = async (data) => {
        const response = await repository.createMessage(data);
        return response;
    };
    return {
        createMessage
    };
};
exports.messageDbInterface = messageDbInterface;
