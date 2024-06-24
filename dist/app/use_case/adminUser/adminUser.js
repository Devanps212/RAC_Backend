"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneUser = exports.blockUnblockUser = exports.getAllUser = void 0;
const getAllUser = async (userInterface) => {
    const users = await userInterface.getAllUsers();
    console.log("users : ", users);
    return users;
};
exports.getAllUser = getAllUser;
const blockUnblockUser = async (userId, userInterface) => {
    await userInterface.blockUnblockUser(userId);
};
exports.blockUnblockUser = blockUnblockUser;
const findOneUser = async (userId, userInterface) => {
    const user = await userInterface.findOneUser(userId);
    return user;
};
exports.findOneUser = findOneUser;
