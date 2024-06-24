"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerRepoInterface = void 0;
const partnerRepoInterface = (repository) => {
    const partnerLogin = async (email) => {
        const response = await repository.partnerLogin(email);
        return response;
    };
    const partnerExist = async (userId) => {
        const response = await repository.partnerexist(userId);
        return response;
    };
    const partnerSignup = async (userId, transactionId, purpose, amount) => {
        const response = await repository.partnerSignUp(userId, transactionId, purpose, amount);
        return response;
    };
    const findPartner = async () => {
        const response = await repository.findAllPartner();
        return response;
    };
    return {
        partnerLogin,
        partnerExist,
        partnerSignup,
        findPartner
    };
};
exports.partnerRepoInterface = partnerRepoInterface;
