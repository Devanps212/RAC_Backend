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
exports.bookingDBInterface = void 0;
const bookingDBInterface = (repository) => {
    const createBooking = (dataDetail, carDetail) => __awaiter(void 0, void 0, void 0, function* () {
        const bookingCreation = yield repository.createBooking(dataDetail, carDetail);
        return bookingCreation;
    });
    const findBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("reached interface");
        const findingBooking = yield repository.findBooking(data);
        return findingBooking;
    });
    const bookingBasedOnRole = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield repository.bookingFindinBaedOnRole(bookingData);
        return response;
    });
    const bookingUpdater = (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const response = yield repository.bookingUpdater(data);
        return response;
    });
    const bookingPagination = (data, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield repository.bookingPagination(data, page, limit);
        return response;
    });
    return {
        createBooking,
        findBooking,
        bookingBasedOnRole,
        bookingUpdater,
        bookingPagination
    };
};
exports.bookingDBInterface = bookingDBInterface;
