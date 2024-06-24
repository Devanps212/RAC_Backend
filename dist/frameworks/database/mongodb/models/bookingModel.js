"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    carId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Cars',
        required: true
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    ownerRole: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'On Hold', 'In Progress'],
        default: 'Pending'
    },
    date: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    time: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    location: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    transaction: {
        type: {
            transactionId: { type: String },
            amount: { type: Number }
        }
    },
    issues: {
        type: String,
        default: ''
    }
});
exports.bookingModel = mongoose_1.default.model('Bookings', bookingSchema);
