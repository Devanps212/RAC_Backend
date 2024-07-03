"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const car_1 = require("../../app/use_case/car/car");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
const booking_1 = require("../../app/use_case/booking/booking");
const __1 = require("../..");
const carController = (carInterface, carRepository, carModel, authService, interfaceAuthService, bookingInterface, bookingRepository, bookingModel) => {
    const carService = carInterface(carRepository(carModel));
    const authservices = interfaceAuthService(authService());
    const bookingService = bookingInterface(bookingRepository(bookingModel));
    const createCars = (0, express_async_handler_1.default)(async (req, res) => {
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
        const carData = req?.body;
        const { name } = carData;
        carData.interior = interior;
        carData.exterior = exterior;
        carData.thumbnailImg = thumbnail.join(',');
        await (0, car_1.checkCar)(name, carService);
        const carCreate = await (0, car_1.createCar)(carData, carService, authservices);
        __1.io.emit('carCreation', {
            message: `New Car Added: The car ${carData.name} has been added by our ${carCreate?.owner} ${carCreate?.addedBy} and is now available for rent. Check it out in our listings!`,
            picture: carCreate?.thumbnailImg
        });
        res.json({
            status: "success",
            message: "car added successfully",
            carCreate
        });
    });
    const editsCar = (0, express_async_handler_1.default)(async (req, res) => {
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
        const response = await (0, car_1.editCar)(carData, carService);
        res.json({
            status: "success",
            message: "Car edited successfully",
            response
        });
    });
    const viewCar = (0, express_async_handler_1.default)(async (req, res) => {
        const { carId } = req?.body;
        const response = await (0, car_1.viewCarDetails)(carId, carService);
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
    });
    const deletesCar = (0, express_async_handler_1.default)(async (req, res) => {
        console.log("deleting car");
        const carId = req?.header('X-Car-Id');
        const data = {
            carId: carId
        };
        const booking = await (0, booking_1.bookingBasedOnRole)(data, bookingService);
        const hasOngoingBooking = Array.isArray(booking)
            ? booking.some(bookings => bookings.status === "Confirmed")
            : booking?.status === "Confirmed";
        if (hasOngoingBooking) {
            console.log("car have a booking ongoing");
            throw new appErrors_1.default(`Unable to delete the car. There is an ongoing booking associated with it.`, httpTypes_1.HttpStatus.CONFLICT);
        }
        else {
            console.log("car dont have any booking");
            const carDelete = await (0, car_1.deleteCar)(carId, carService);
            res.json({
                status: carDelete?.status,
                message: carDelete?.message,
            });
        }
    });
    const findsCar = (0, express_async_handler_1.default)(async (req, res) => {
        const carData = req?.query.carData;
        const response = await (0, car_1.findCar)(carData, carService);
        res.json({
            status: "success",
            message: "cars retreived",
            response
        });
    });
    const findCarsBasedOnRole = (0, express_async_handler_1.default)(async (req, res) => {
        const role = req.query.role;
        const cars = await (0, car_1.carBasedOnRole)(role, carService);
        res.json({
            data: cars,
            status: 'success'
        });
    });
    const carUpdateBasedOnRole = (0, express_async_handler_1.default)(async (req, res) => {
        const data = req.body;
        console.log("data recieved : ", data);
        const updateCar = await (0, car_1.carPartialUpdate)(data, carService);
        res.json({
            data: updateCar,
            status: "success"
        });
    });
    const updateRating = (0, express_async_handler_1.default)(async (req, res) => {
        const { data, carId, userId } = req.body;
        const car = await (0, car_1.findCar)(carId, carService);
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
        const update = await (0, car_1.updateCar)(car._id?.toString() ?? '', car, carService);
        res.json({
            data: update,
            message: 'success fully submitted review'
        });
    });
    const carPaginations = (0, express_async_handler_1.default)(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const carPage = await (0, car_1.carPagination)(page, limit, carService);
        res.json({
            cars: carPage.cars,
            totalCount: carPage.totalCount,
            status: "success"
        });
    });
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
