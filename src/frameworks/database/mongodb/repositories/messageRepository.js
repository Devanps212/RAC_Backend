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
exports.messageRepository = void 0;
const messageEntity_1 = require("../../../../entities/messageEntity");
const messageRepository = (model) => {
    const messageEntity = new messageEntity_1.MessagesEntity(model);
    const createMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield messageEntity.createMessage(data);
        return response;
    });
    return {
        createMessage
    };
};
exports.messageRepository = messageRepository;
