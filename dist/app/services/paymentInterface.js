"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentInterface = void 0;
const paymentInterface = (paymentService) => {
    const paymentPhonepayUser = async (bookingDetail, car, userId) => {
        const response = await paymentService.paymentMakingService(bookingDetail, car, userId);
        return response;
    };
    const sessionVerification = async (sessionId) => {
        const response = await paymentService.stripeSessionVerify(sessionId);
        return response;
    };
    const paymentExtent = async (bookingDetail, car, userId) => {
        const response = await paymentService.paymentExtent(bookingDetail, car, userId);
        return response;
    };
    const paymentRefund = async (bookingData) => {
        const response = await paymentService.PaymentRefund(bookingData);
        return response;
    };
    const signUpPartnerPayment = async (paymentData) => {
        const response = await paymentService.partnerPaymentForSignUp(paymentData);
        return response;
    };
    return {
        signUpPartnerPayment,
        paymentPhonepayUser,
        sessionVerification,
        paymentRefund,
        paymentExtent
    };
};
exports.paymentInterface = paymentInterface;
