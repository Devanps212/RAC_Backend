"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingDBInterface = void 0;
const bookingDBInterface = (repository) => {
    const createBooking = async (dataDetail, carDetail) => {
        const bookingCreation = await repository.createBooking(dataDetail, carDetail);
        return bookingCreation;
    };
    const findBooking = async (data) => {
        console.log("reached interface");
        const findingBooking = await repository.findBooking(data);
        return findingBooking;
    };
    const bookingBasedOnRole = async (bookingData) => {
        const response = await repository.bookingFindinBaedOnRole(bookingData);
        return response;
    };
    const bookingUpdater = async (data) => {
        console.log(data);
        const response = await repository.bookingUpdater(data);
        return response;
    };
    const bookingPagination = async (data, page, limit) => {
        const response = await repository.bookingPagination(data, page, limit);
        return response;
    };
    return {
        createBooking,
        findBooking,
        bookingBasedOnRole,
        bookingUpdater,
        bookingPagination
    };
};
exports.bookingDBInterface = bookingDBInterface;
