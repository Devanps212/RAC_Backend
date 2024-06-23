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
exports.bookingPagination = exports.stripeRefund = exports.stripePaymentVeification = exports.bookingReschedule = exports.BookingUpdater = exports.bookingBasedOnRole = exports.bookingPayment = exports.findBooking = exports.createBooking = void 0;
const createBooking = (data, carDetails, bookingInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield bookingInterface.createBooking(data, carDetails);
    return response;
});
exports.createBooking = createBooking;
const findBooking = (data, bookingInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reached usecase");
    const response = yield bookingInterface.findBooking(data);
    return response;
});
exports.findBooking = findBooking;
const bookingPayment = (bookingDetail, car, userId, paymentInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield paymentInterface.paymentPhonepayUser(bookingDetail, car, userId);
    return response;
});
exports.bookingPayment = bookingPayment;
const bookingBasedOnRole = (bookingData, bookingInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield bookingInterface.bookingBasedOnRole(bookingData);
    return response;
});
exports.bookingBasedOnRole = bookingBasedOnRole;
const BookingUpdater = (data, bookingInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    const response = yield bookingInterface.bookingUpdater(data);
    return response;
});
exports.BookingUpdater = BookingUpdater;
const bookingReschedule = (bookingDetail, car, userId, paymentInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield paymentInterface.paymentExtent(bookingDetail, car, userId);
    return response;
});
exports.bookingReschedule = bookingReschedule;
const stripePaymentVeification = (sessionId, paymentInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield paymentInterface.sessionVerification(sessionId);
    return response;
});
exports.stripePaymentVeification = stripePaymentVeification;
const stripeRefund = (data, paymentInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield paymentInterface.paymentRefund(data);
    return response;
});
exports.stripeRefund = stripeRefund;
const bookingPagination = (data, page, limit, bookingInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield bookingInterface.bookingPagination(data, page, limit);
    return response;
});
exports.bookingPagination = bookingPagination;
