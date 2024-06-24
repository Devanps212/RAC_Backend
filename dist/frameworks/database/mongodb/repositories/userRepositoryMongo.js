"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const user_1 = require("../../../../entities/user");
const userRepository = (model) => {
    const userEntity = new user_1.UserEntity(model);
    const createUser = async (user) => {
        const newUser = await userEntity.createUser(user);
        return newUser;
    };
    const getUserByEmail = async (email) => {
        const user = await userEntity.getUserByEmail(email);
        return user;
    };
    const getAllUser = async () => {
        const users = await userEntity.allUser();
        return users;
    };
    const blockUnblockUser = async (userId) => {
        await userEntity.blockUnblockUser(userId);
    };
    const findOneUser = async (userId) => {
        console.log("userId: ", userId);
        const user = await userEntity.userFindOne(userId);
        return user;
    };
    const findUser = async (id) => {
        const user = await userEntity.findUsers(id);
        return user;
    };
    const updateUser = async (data) => {
        const response = await userEntity.userUpdate(data);
        return response;
    };
    const findMongoAllUsers = async () => {
        const response = await userEntity.findAllUsersFromMongo();
        return response;
    };
    const findUsersForConversation = async (id) => {
        const response = await userEntity.findUsersForConversation(id);
        return response;
    };
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
