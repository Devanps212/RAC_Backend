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
exports.userRepository = void 0;
const user_1 = require("../../../../entities/user");
const userRepository = (model) => {
    const userEntity = new user_1.UserEntity(model);
    const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield userEntity.createUser(user);
        return newUser;
    });
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userEntity.getUserByEmail(email);
        return user;
    });
    const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield userEntity.allUser();
        return users;
    });
    const blockUnblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield userEntity.blockUnblockUser(userId);
    });
    const findOneUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("userId: ", userId);
        const user = yield userEntity.userFindOne(userId);
        return user;
    });
    const findUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userEntity.findUsers(id);
        return user;
    });
    const updateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userEntity.userUpdate(data);
        return response;
    });
    const findMongoAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userEntity.findAllUsersFromMongo();
        return response;
    });
    const findUsersForConversation = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userEntity.findUsersForConversation(id);
        return response;
    });
    return {
        createUser,
        getUserByEmail,
        getAllUser,
        blockUnblockUser,
        findOneUser,
        findUser,
        updateUser,
        findMongoAllUsers,
        findUsersForConversation
    };
};
exports.userRepository = userRepository;
