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
exports.findOneUser = exports.blockUnblockUser = exports.getAllUser = void 0;
const getAllUser = (userInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userInterface.getAllUsers();
    console.log("users : ", users);
    return users;
});
exports.getAllUser = getAllUser;
const blockUnblockUser = (userId, userInterface) => __awaiter(void 0, void 0, void 0, function* () {
    yield userInterface.blockUnblockUser(userId);
});
exports.blockUnblockUser = blockUnblockUser;
const findOneUser = (userId, userInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userInterface.findOneUser(userId);
    return user;
});
exports.findOneUser = findOneUser;
