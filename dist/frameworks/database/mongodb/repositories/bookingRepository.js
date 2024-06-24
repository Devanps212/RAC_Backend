"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = void 0;
const booking_1 = require("../../../../entities/booking");
const bookingRepository = (bookingModel) => {
    const enitityBooking = new booking_1.BookingEnity(bookingModel);
    const createBooking = async (data, carDetail) => {
        const response = await enitityBooking.bookingCreation(data, carDetail);
        return response;
    };
    const findBooking = async (bookingDetail) => {
        console.log("reached repository");
        const response = await enitityBooking.findBooking(bookingDetail);
        return response;
    };
    const bookingFindinBaedOnRole = async (bookingData) => {
        const response = await enitityBooking.bookingFindingBasedOnRole(bookingData);
        return response;
    };
    const bookingUpdater = async (data) => {
        const response = await enitityBooking.BookingUpdater(data);
        return response;
    };
    const bookingPagination = async (data, page, limit) => {
        const response = await enitityBooking.BookingPagination(data, page, limit);
        return response;
    };
    return {
        createBooking,
        findBooking,
        bookingFindinBaedOnRole,
        bookingUpdater,
        bookingPagination
    };
};
exports.bookingRepository = bookingRepository;
