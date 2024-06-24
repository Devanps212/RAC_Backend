"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../../config"));
// mongoose.set('strictQuery', true)
const connectDb = async () => {
    console.log('hi');
    try {
        console.log(config_1.default.MONGO_URL, '------');
        await mongoose_1.default.connect(config_1.default.MONGO_URL);
        console.log('Database connected');
    }
    catch (error) {
        console.log(error, 'error from db ');
        process.exit(1);
    }
};
exports.default = connectDb;
