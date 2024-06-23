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
exports.carRepoInterface = void 0;
const carRepoInterface = (repository) => {
    const createCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.createCar(carData);
    });
    const editCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("editiong data");
        return yield repository.editCar(carData);
    });
    const deleteCar = (carId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.delteCar(carId);
    });
    const findCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.findCar(carData);
    });
    const viewCar = (carId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.viewdetails(carId);
    });
    const checkCar = (name) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.carExist(name);
    });
    const updateCar = (carId, carData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.carUpdate(carId, carData);
    });
    const carBasedOnrole = (role) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.carFindBasedOnRole(role);
    });
    const carPartialUpdate = (data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.carUpdateBasedOnRole(data);
    });
    const carPagination = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.carPagination(page, limit);
    });
    return {
        createCar,
        deleteCar,
        editCar,
        findCar,
        viewCar,
        checkCar,
        updateCar,
        carPagination,
        carBasedOnrole,
        carPartialUpdate
    };
};
exports.carRepoInterface = carRepoInterface;
