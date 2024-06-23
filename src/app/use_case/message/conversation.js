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
exports.findMessage = exports.addMessage = exports.sendMessage = void 0;
const httpTypes_1 = require("../../../types/httpTypes");
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const sendMessage = (data, conversationInterface, authInterface) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("data :", data);
        if (!data.senderId) {
            console.log(data);
            throw new appErrors_1.default("token not found", httpTypes_1.HttpStatus.NOT_FOUND);
        }
        const response = yield conversationInterface.setParticipants(data);
        return response;
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
exports.sendMessage = sendMessage;
const addMessage = (messageId, conversationId, conversationInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield conversationInterface.addMessage(messageId, conversationId);
    return response;
});
exports.addMessage = addMessage;
const findMessage = (oppositeUserId, senderId, conversationInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield conversationInterface.findMessage(oppositeUserId, senderId);
    return response;
});
exports.findMessage = findMessage;
