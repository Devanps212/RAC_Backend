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
exports.carRepository = void 0;
const carEntity_1 = require("../../../../entities/carEntity");
const carRepository = (model) => {
    const CarEntity = new carEntity_1.carEntity(model);
    const createCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
        const createdCar = yield CarEntity.addCar(carData);
        return createdCar;
    });
    const editCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("reached repository");
        const carEdit = yield CarEntity.editCar(carData);
        return carEdit;
    });
    const delteCar = (carId) => __awaiter(void 0, void 0, void 0, function* () {
        const carDelete = yield CarEntity.deleteCar(carId);
        return carDelete;
    });
    const findCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
        const carFind = yield CarEntity.findCar(carData);
        return carFind;
    });
    const viewdetails = (carId) => __awaiter(void 0, void 0, void 0, function* () {
        const carView = yield CarEntity.viewCarDetails(carId);
        return carView;
    });
    const carExist = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const ExistCar = yield CarEntity.checkCarByName(name);
        return ExistCar;
    });
    const carUpdate = (carId, carData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield CarEntity.carUpdater(carId, carData);
        return response;
    });
    const carFindBasedOnRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield CarEntity.carBasedOnRole(role);
        return response;
    });
    const carUpdateBasedOnRole = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield CarEntity.carPartialUpdate(data);
        return response;
    });
    const carPagination = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        const ExistCar = yield CarEntity.carPagination(page, limit);
        return ExistCar;
    });
    return {
        createCar,
        delteCar,
        editCar,
        findCar,
        viewdetails,
        carPagination,
        carExist,
        carUpdate,
        carFindBasedOnRole,
        carUpdateBasedOnRole
    };
};
exports.carRepository = carRepository;
