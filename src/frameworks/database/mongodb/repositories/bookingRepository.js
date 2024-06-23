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
exports.bookingRepository = void 0;
const booking_1 = require("../../../../entities/booking");
const bookingRepository = (bookingModel) => {
    const enitityBooking = new booking_1.BookingEnity(bookingModel);
    const createBooking = (data, carDetail) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield enitityBooking.bookingCreation(data, carDetail);
        return response;
    });
    const findBooking = (bookingDetail) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("reached repository");
        const response = yield enitityBooking.findBooking(bookingDetail);
        return response;
    });
    const bookingFindinBaedOnRole = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield enitityBooking.bookingFindingBasedOnRole(bookingData);
        return response;
    });
    const bookingUpdater = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield enitityBooking.BookingUpdater(data);
        return response;
    });
    const bookingPagination = (data, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield enitityBooking.BookingPagination(data, page, limit);
        return response;
    });
    return {
        createBooking,
        findBooking,
        bookingFindinBaedOnRole,
        bookingUpdater,
        bookingPagination
    };
};
exports.bookingRepository = bookingRepository;
