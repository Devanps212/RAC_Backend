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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const car_1 = require("../../app/use_case/car/car");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
const carController = (carInterface, carRepository, carModel, authService, interfaceAuthService) => {
    const carService = carInterface(carRepository(carModel));
    const authservices = interfaceAuthService(authService());
    const createCars = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files;
        let interior = [];
        let exterior = [];
        let thumbnail = [];
        if (files.interior) {
            interior = files.interior.map(data => data.path);
        }
        else {
            throw new Error("No 'interior' files found.");
        }
        if (files.exterior) {
            console.log("\nFilenames for exterior:");
            exterior = files.exterior.map(data => data.path);
        }
        else {
            throw new Error("No 'exterior' files found.");
        }
        if (files.thumbnailImg) {
            thumbnail = files.thumbnailImg.map(data => data.path);
        }
        const carData = req === null || req === void 0 ? void 0 : req.body;
        const { name } = carData;
        carData.interior = interior;
        carData.exterior = exterior;
        carData.thumbnailImg = thumbnail.join(',');
        yield (0, car_1.checkCar)(name, carService);
        const carCreate = yield (0, car_1.createCar)(carData, carService, authservices);
        res.json({
            status: "success",
            message: "car added successfully",
            carCreate
        });
    }));
    const editsCar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const carData = req.body;
        const files = req.files;
        let interior = [];
        let exterior = [];
        let thumbnail = [];
        if (files.interior) {
            interior = files.interior.map(data => data.path);
            carData.interior = interior;
        }
        if (files.exterior) {
            exterior = files.exterior.map(data => data.path);
            carData.exterior = exterior;
        }
        if (files.thumbnailImg) {
            thumbnail = files.thumbnailImg.map(data => data.path);
            carData.thumbnailImg = thumbnail.toString();
        }
        const response = yield (0, car_1.editCar)(carData, carService);
        res.json({
            status: "success",
            message: "Car edited successfully",
            response
        });
    }));
    const viewCar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { carId } = req === null || req === void 0 ? void 0 : req.body;
        const response = yield (0, car_1.viewCarDetails)(carId, carService);
        if (response && 'message' in response) {
            res.json({
                status: "failed",
                message: response.message,
            });
        }
        else {
            res.json({
                status: "success",
                message: "user retreived successfully",
                response
            });
        }
    }));
    const deletesCar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const carId = req === null || req === void 0 ? void 0 : req.header('X-Car-Id');
        const carDelete = yield (0, car_1.deleteCar)(carId, carService);
        res.json({
            status: carDelete === null || carDelete === void 0 ? void 0 : carDelete.status,
            message: carDelete === null || carDelete === void 0 ? void 0 : carDelete.message,
        });
    }));
    const findsCar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const carData = req === null || req === void 0 ? void 0 : req.query.carData;
        const response = yield (0, car_1.findCar)(carData, carService);
        res.json({
            status: "success",
            message: "cars retreived",
            response
        });
    }));
    const findCarsBasedOnRole = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const role = req.query.role;
        const cars = yield (0, car_1.carBasedOnRole)(role, carService);
        res.json({
            data: cars,
            status: 'success'
        });
    }));
    const carUpdateBasedOnRole = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        const updateCar = yield (0, car_1.carPartialUpdate)(data, carService);
        res.json({
            data: updateCar,
            status: "success"
        });
    }));
    const updateRating = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { data, carId, userId } = req.body;
        const car = yield (0, car_1.findCar)(carId, carService);
        if (Array.isArray(car) || car === null) {
            throw new appErrors_1.default("car isn't availbale", httpTypes_1.HttpStatus.EXPECTATION_FAILED);
        }
        const ratingDetail = data;
        const totalRatings = car.ratingsCount || 0;
        const currentRating = car.rating || 0;
        const newRating = (ratingDetail.car + ratingDetail.valueForMoney + ratingDetail.comfort + ratingDetail.performance) / 4;
        const updatedRating = ((currentRating * totalRatings) + newRating) / (totalRatings + 1);
        car.rating = updatedRating;
        car.ratingsCount = totalRatings + 1;
        if (ratingDetail.review && car.comments !== undefined && Array.isArray(car.comments)) {
            car.comments.push({
                userId: userId,
                comment: ratingDetail.review,
                userRating: newRating,
            });
        }
        const update = yield (0, car_1.updateCar)((_b = (_a = car._id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '', car, carService);
        res.json({
            data: update,
            message: 'success fully submitted review'
        });
    }));
    const carPaginations = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const carPage = yield (0, car_1.carPagination)(page, limit, carService);
        res.json({
            cars: carPage.cars,
            totalCount: carPage.totalCount,
            status: "success"
        });
    }));
    return {
        createCars,
        editsCar,
        viewCar,
        deletesCar,
        findsCar,
        updateRating,
        findCarsBasedOnRole,
        carUpdateBasedOnRole,
        carPaginations,
    };
};
exports.carController = carController;