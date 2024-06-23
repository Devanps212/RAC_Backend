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
exports.conversationEntity = void 0;
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class conversationEntity {
    constructor(model) {
        this.model = model;
    }
    createConversation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let conversation = yield this.model.findOne({ participants: { $all: [data.senderId, data.recieverId] } });
                if (!conversation) {
                    conversation = yield this.model.create({ participants: [data.senderId, data.recieverId] });
                }
                return conversation.toObject();
            }
            catch (error) {
                console.error(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    MessageAdd(messageId, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const edit = yield this.model.findOneAndUpdate({ _id: conversationId }, { $push: { messages: messageId } }, { new: true, useFindAndModify: false });
                if (!edit) {
                    throw new appErrors_1.default("can't save message", httpTypes_1.HttpStatus.NOT_MODIFIED);
                }
                return edit.toObject();
            }
            catch (error) {
                console.error(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getMessage(oppositeUserId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessage = yield this.model.findOne({ participants: { $all: [oppositeUserId, senderId] } }).populate('messages');
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
        });
    }
}
exports.conversationEntity = conversationEntity;
