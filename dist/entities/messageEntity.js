"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesEntity = void 0;
const appErrors_1 = __importDefault(require("../utils/appErrors"));
const httpTypes_1 = require("../types/httpTypes");
class MessagesEntity {
    constructor(model) {
        this.model = model;
    }
    async createMessage(message) {
        try {
            console.log("receiever id  : ", message.recieverId);
            console.log(message);
            const createMessage = await this.model.create({
                message: message.message,
                recieverId: message.recieverId,
                senderId: message.senderId
            });
            if (message.recieverId) {
                console.log("going to listen to the message");
            }
            else {
                console.log("no receiever id found");
            }
            if (!createMessage) {
                throw new appErrors_1.default('message creation failed', httpTypes_1.HttpStatus.EXPECTATION_FAILED);
            }
            return createMessage.toObject();
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.MessagesEntity = MessagesEntity;
