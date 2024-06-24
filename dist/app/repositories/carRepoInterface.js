"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRepoInterface = void 0;
const carRepoInterface = (repository) => {
    const createCar = async (carData) => {
        return await repository.createCar(carData);
    };
    const editCar = async (carData) => {
        console.log("editiong data");
        return await repository.editCar(carData);
    };
    const deleteCar = async (carId) => {
        return await repository.delteCar(carId);
    };
    const findCar = async (carData) => {
        return await repository.findCar(carData);
    };
    const viewCar = async (carId) => {
        return await repository.viewdetails(carId);
    };
    const checkCar = async (name) => {
        return await repository.carExist(name);
    };
    const updateCar = async (carId, carData) => {
        return await repository.carUpdate(carId, carData);
    };
    const carBasedOnrole = async (role) => {
        return await repository.carFindBasedOnRole(role);
    };
    const carPartialUpdate = async (data) => {
        return await repository.carUpdateBasedOnRole(data);
    };
    const carPagination = async (page, limit) => {
        return await repository.carPagination(page, limit);
    };
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
