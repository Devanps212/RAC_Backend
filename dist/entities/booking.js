"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEnity = void 0;
const mongoose_1 = require("mongoose");
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class BookingEnity {
    constructor(model) {
        this.model = model;
    }
    async bookingCreation(data, carDetails) {
        try {
            const addedById = carDetails.addedById;
            const addedRole = carDetails.owner;
            let bookingFormat = null;
            const { pickupLocation, dropOffLocation, pickupTime, dropOffTime, startDate, endDate, amount, total } = data.bookingDetails;
            if (pickupLocation !== undefined &&
                dropOffLocation !== undefined &&
                pickupTime !== undefined &&
                dropOffTime !== undefined &&
                startDate !== undefined &&
                endDate !== undefined &&
                total !== undefined &&
                addedById !== undefined &&
                addedRole !== undefined) {
                console.log("booking format");
                bookingFormat = {
                    carId: carDetails._id?.toString() ?? '',
                    userId: data.userId,
                    date: { start: startDate, end: endDate },
                    location: { start: pickupLocation, end: dropOffLocation },
                    time: { start: pickupTime, end: dropOffTime },
                    status: 'Confirmed',
                    owner: addedById,
                    transaction: { amount: total, transactionId: data.transactionId },
                    ownerRole: addedRole,
                    issues: '',
                };
            }
            const bookingData = await this.model.create(bookingFormat);
            if (bookingData !== null) {
                return bookingData.toObject();
            }
            else {
                console.log("can't book");
                throw new appErrors_1.default("can't book", httpTypes_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            console.log(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findBooking(data) {
        try {
            if (data === 'all') {
                const bookingFinding = await this.model.find().populate("carId");
                if (bookingFinding.length === 0) {
                    return { message: "no bookings found" };
                }
                else {
                    return bookingFinding.map(booking => booking.toObject());
                }
            }
            else if (mongoose_1.Types.ObjectId.isValid(data)) {
                const bookingFinding = await this.model.findOne({ _id: data }).populate("carId");
                if (bookingFinding) {
                    return bookingFinding.toObject();
                }
                else {
                    return { message: "not found" };
                }
            }
            else {
                console.log("no booking found");
                return null;
            }
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bookingFindingBasedOnRole(bookingData) {
        try {
            const bookingDetail = await this.model.find(bookingData).populate('carId');
            if (bookingDetail.length === 0) {
                return [];
            }
            else if (bookingDetail.length === 1) {
                return bookingDetail[0].toObject();
            }
            else {
                return bookingDetail.map(booking => booking.toObject());
            }
        }
        catch (error) {
            console.log(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async BookingUpdater(data) {
        try {
            if (!data._id) {
                return { message: "No booking ID provided" };
            }
            const bookingId = data._id;
            const booking = await this.model.findById(bookingId);
            if (booking) {
                if (Object.keys(data).length > 0) {
                    Object.assign(booking, data);
                    await booking.save();
                    return booking.toObject();
                }
                else {
                    return { message: "nothing to save" };
                }
            }
            else {
                return { message: "no bookings found" };
            }
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async BookingPagination(data, page, limit) {
        try {
            let bookings;
            let totalCount;
            if (typeof data === "string") {
                bookings = await this.model.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('carId')
                    .exec();
                totalCount = await this.model.countDocuments();
            }
            else {
                bookings = await this.model.find({ ...data })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('carId')
                    .exec();
                totalCount = await this.model.countDocuments({ ...data });
            }
            const formattedBookings = bookings.map((booking) => booking.toObject());
            return {
                formattedBookings,
                totalCount
            };
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.BookingEnity = BookingEnity;
