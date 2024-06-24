"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    userRating: {
        type: Number
    }
});
const carSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
        enum: ['Admin', 'Partner']
    },
    category: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    mileage: {
        type: Number,
        default: 0
    },
    engine: {
        type: String,
        default: '',
    },
    transmission: {
        type: String,
        default: '',
    },
    fuelType: {
        type: String,
        default: '',
    },
    interior: {
        type: [String],
        default: [],
    },
    exterior: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['available', 'maintenance', 'booked', 'not available'],
        default: '',
    },
    rating: {
        type: Number,
        default: 0,
    },
    ratingsCount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: '',
    },
    comments: {
        type: [comments],
        default: [],
    },
    vehicleNumber: {
        type: String,
        default: '',
    },
    rentPricePerWeek: {
        type: Number,
        default: 0,
    },
    rentPricePerDay: {
        type: Number,
        default: 0,
    },
    insuranceDetails: {
        type: String,
        default: '',
    },
    seats: {
        type: Number,
        required: true
    },
    addedBy: {
        type: String,
        required: true,
    },
    addedById: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refpath: 'owner'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    thumbnailImg: {
        type: String,
        required: true
    },
    offer: {
        discount: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: null
        }
    }
});
exports.carModel = mongoose_1.default.model('Cars', carSchema);
