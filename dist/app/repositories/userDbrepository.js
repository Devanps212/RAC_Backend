"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userdbRepository = void 0;
const userdbRepository = (repository) => {
    const createUser = async (user) => {
        return await repository.createUser(user);
    };
    const getUserByEmail = async (email) => {
        return await repository.getUserByEmail(email);
    };
    const getAllUsers = async () => {
        return await repository.getAllUser();
    };
    const blockUnblockUser = async (userId) => {
        await repository.blockUnblockUser(userId);
    };
    const findOneUser = async (userId) => {
        const user = await repository.findOneUser(userId);
        return user;
    };
    const findUser = async (id) => {
        const user = await repository.findUser(id);
        return user;
    };
    const userUpdate = async (data) => {
        const response = await repository.updateUser(data);
        return response;
    };
    const findMongoAllUsers = async () => {
        const response = await repository.findMongoAllUsers();
        return response;
    };
    const findUsersForConversation = async (id) => {
        const user = await repository.findUsersForConversation(id);
        return user;
    };
    return {
        createUser,
        getUserByEmail,
        getAllUsers,
        blockUnblockUser,
        findOneUser,
        findUser,
        userUpdate,
        findMongoAllUsers,
        findUsersForConversation
    };
};
exports.userdbRepository = userdbRepository;
