"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRepository = void 0;
const carEntity_1 = require("../../../../entities/carEntity");
const carRepository = (model) => {
    const CarEntity = new carEntity_1.carEntity(model);
    const createCar = async (carData) => {
        const createdCar = await CarEntity.addCar(carData);
        return createdCar;
    };
    const editCar = async (carData) => {
        console.log("reached repository");
        const carEdit = await CarEntity.editCar(carData);
        return carEdit;
    };
    const delteCar = async (carId) => {
        const carDelete = await CarEntity.deleteCar(carId);
        return carDelete;
    };
    const findCar = async (carData) => {
        const carFind = await CarEntity.findCar(carData);
        return carFind;
    };
    const viewdetails = async (carId) => {
        const carView = await CarEntity.viewCarDetails(carId);
        return carView;
    };
    const carExist = async (name) => {
        const ExistCar = await CarEntity.checkCarByName(name);
        return ExistCar;
    };
    const carUpdate = async (carId, carData) => {
        const response = await CarEntity.carUpdater(carId, carData);
        return response;
    };
    const carFindBasedOnRole = async (role) => {
        const response = await CarEntity.carBasedOnRole(role);
        return response;
    };
    const carUpdateBasedOnRole = async (data) => {
        const response = await CarEntity.carPartialUpdate(data);
        return response;
    };
    const carPagination = async (page, limit) => {
        const ExistCar = await CarEntity.carPagination(page, limit);
        return ExistCar;
    };
    const carFindBasedOnInterfaces = async (data) => {
        const response = await CarEntity.carFindBasedOnInterface(data);
        return response;
    };
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
        carUpdateBasedOnRole,
        carFindBasedOnInterfaces
    };
};
exports.carRepository = carRepository;
