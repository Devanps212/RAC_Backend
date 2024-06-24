"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationEntity = void 0;
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class conversationEntity {
    constructor(model) {
        this.model = model;
    }
    async createConversation(data) {
        try {
            let conversation = await this.model.findOne({ participants: { $all: [data.senderId, data.recieverId] } });
            if (!conversation) {
                conversation = await this.model.create({ participants: [data.senderId, data.recieverId] });
            }
            return conversation.toObject();
        }
        catch (error) {
            console.error(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async MessageAdd(messageId, conversationId) {
        try {
            const edit = await this.model.findOneAndUpdate({ _id: conversationId }, { $push: { messages: messageId } }, { new: true, useFindAndModify: false });
            if (!edit) {
                throw new appErrors_1.default("can't save message", httpTypes_1.HttpStatus.NOT_MODIFIED);
            }
            return edit.toObject();
        }
        catch (error) {
            console.error(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMessage(oppositeUserId, senderId) {
        try {
            const findMessage = await this.model.findOne({ participants: { $all: [oppositeUserId, senderId] } }).populate('messages');
            // console.log("message found : ", findMessage)
            if (!findMessage) {
                throw new appErrors_1.default('no conversation found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            const messages = findMessage.messages;
            // console.log("message found  :", messages)
            return messages.toObject();
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.conversationEntity = conversationEntity;
