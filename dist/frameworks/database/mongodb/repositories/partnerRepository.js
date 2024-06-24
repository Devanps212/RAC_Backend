"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerDbRepo = void 0;
const partner_1 = require("../../../../entities/partner");
const partnerDbRepo = (model) => {
    const PartnerEntity = new partner_1.partnerEntity(model);
    const partnerLogin = async (email) => {
        const response = await PartnerEntity.partnerLogin(email);
        return response;
    };
    const partnerexist = async (partnerId) => {
        const response = await PartnerEntity.partnerExist(partnerId);
        return response;
    };
    const partnerSignUp = async (userId, transactionId, purpose, amount) => {
        const response = await PartnerEntity.partnerCreate(userId, transactionId, purpose, amount);
        return response;
    };
    const findAllPartner = async () => {
        const response = await PartnerEntity.findAllPartner();
        return response;
    };
    return {
        partnerLogin,
        partnerexist,
        partnerSignUp,
        findAllPartner
    };
};
exports.partnerDbRepo = partnerDbRepo;
