"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewMessage = void 0;
const createNewMessage = async (data, messageInterface) => {
    const response = await messageInterface.createMessage(data);
    return response;
};
exports.createNewMessage = createNewMessage;
