"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpPayment = exports.partnerExist = void 0;
const partnerExist = async (partnerId, partnerInterface) => {
    const response = await partnerInterface.partnerExist(partnerId);
    return response;
};
exports.partnerExist = partnerExist;
const signUpPayment = async (paymentData, paymentInterface) => {
    console.log("passing response");
    const response = await paymentInterface.signUpPartnerPayment(paymentData);
    return response;
};
exports.signUpPayment = signUpPayment;
