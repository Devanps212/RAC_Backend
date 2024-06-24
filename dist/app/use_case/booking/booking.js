"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingPagination = exports.stripeRefund = exports.stripePaymentVeification = exports.bookingReschedule = exports.BookingUpdater = exports.bookingBasedOnRole = exports.bookingPayment = exports.findBooking = exports.createBooking = void 0;
const createBooking = async (data, carDetails, bookingInterface) => {
    const response = await bookingInterface.createBooking(data, carDetails);
    return response;
};
exports.createBooking = createBooking;
const findBooking = async (data, bookingInterface) => {
    console.log("reached usecase");
    const response = await bookingInterface.findBooking(data);
    return response;
};
exports.findBooking = findBooking;
const bookingPayment = async (bookingDetail, car, userId, paymentInterface) => {
    const response = await paymentInterface.paymentPhonepayUser(bookingDetail, car, userId);
    return response;
};
exports.bookingPayment = bookingPayment;
const bookingBasedOnRole = async (bookingData, bookingInterface) => {
    const response = await bookingInterface.bookingBasedOnRole(bookingData);
    return response;
};
exports.bookingBasedOnRole = bookingBasedOnRole;
const BookingUpdater = async (data, bookingInterface) => {
    console.log(data);
    const response = await bookingInterface.bookingUpdater(data);
    return response;
};
exports.BookingUpdater = BookingUpdater;
const bookingReschedule = async (bookingDetail, car, userId, paymentInterface) => {
    const response = await paymentInterface.paymentExtent(bookingDetail, car, userId);
    return response;
};
exports.bookingReschedule = bookingReschedule;
const stripePaymentVeification = async (sessionId, paymentInterface) => {
    const response = await paymentInterface.sessionVerification(sessionId);
    return response;
};
exports.stripePaymentVeification = stripePaymentVeification;
const stripeRefund = async (data, paymentInterface) => {
    const response = await paymentInterface.paymentRefund(data);
    return response;
};
exports.stripeRefund = stripeRefund;
const bookingPagination = async (data, page, limit, bookingInterface) => {
    const response = await bookingInterface.bookingPagination(data, page, limit);
    return response;
};
exports.bookingPagination = bookingPagination;
