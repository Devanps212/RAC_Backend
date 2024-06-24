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
            console.log("reached booking entity");
            const addedById = carDetails.addedById;
            const addedRole = carDetails.owner;
            console.log("whole data : ", data);
            console.log("booking Detail :", data.transactionId);
            console.log("booking Detail :", data.carId);
            console.log("booking Detail :", data.bookingDetails);
            let bookingFormat = null;
            const { pickupLocation, dropOffLocation, pickupTime, dropOffTime, startDate, endDate, amount, total } = data.bookingDetails;
            console.log("checking condition");
            console.log(pickupLocation, dropOffLocation, pickupTime, dropOffTime, startDate, endDate, amount);
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
                console.log(bookingFormat);
            }
            const bookingData = await this.model.create(bookingFormat);
            if (bookingData !== null) {
                console.log("Booked");
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
            console.log("updating");
            const bookingDetail = await this.model.find(bookingData).populate('carId');
            if (bookingDetail.length === 0) {
                return [];
            }
            else if (bookingDetail.length === 1) {
                return bookingDetail[0].toObject(); // 
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
            console.log("reached booking updating");
            if (!data._id) {
                return { message: "No booking ID provided" };
            }
            const bookingId = data._id;
            const booking = await this.model.findById(bookingId);
            if (booking) {
                console.log("datas for update : ", data);
                if (Object.keys(data).length > 0) {
                    Object.assign(booking, data);
                    console.log("updating booking :", booking);
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
