"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carPagination = exports.carPartialUpdate = exports.carBasedOnRole = exports.updateCar = exports.checkCar = exports.viewCarDetails = exports.findCar = exports.deleteCar = exports.editCar = exports.createCar = void 0;
const __1 = require("../../..");
const createCar = async (carData, carRepInterface, authInterface) => {
    console.log("Data received");
    if (carData.addedById) {
        console.log("reached edit car");
        const tokenData = await authInterface.tokenVerification(carData.addedById);
        if (typeof tokenData === 'object' && tokenData.hasOwnProperty('payload')) {
            console.log(tokenData);
            const payload = tokenData.payload;
            console.log("Token payload:", payload);
            carData.addedById = payload;
        }
    }
    const carCreate = await carRepInterface.createCar(carData);
    return carCreate;
};
exports.createCar = createCar;
const editCar = async (carData, carRepoInterface) => {
    console.log("reached edit car");
    const carEdit = await carRepoInterface.editCar(carData);
    return carEdit;
};
exports.editCar = editCar;
const deleteCar = async (carId, carRepoInterface) => {
    console.log("data receieved from edit :", carId);
    const carDelete = await carRepoInterface.deleteCar(carId);
    return carDelete;
};
exports.deleteCar = deleteCar;
const findCar = async (carData, carRepoInterface) => {
    const carFind = await carRepoInterface.findCar(carData);
    return carFind;
};
exports.findCar = findCar;
const viewCarDetails = async (carId, carRepoInterface) => {
    console.log("data receieved from edit :", carId);
    const carView = await carRepoInterface.viewCar(carId);
    return carView;
};
exports.viewCarDetails = viewCarDetails;
const checkCar = async (name, carRepoInterface) => {
    console.log("car checking");
    const carExist = await carRepoInterface.checkCar(name);
    return carExist;
};
exports.checkCar = checkCar;
// export const statusUpdater = async(carId: string, carRepoInterface : ReturnType<carInterfaceType>)=>{
//     const response = await carRepoInterface
//     return response 
// }
const updateCar = async (carId, carData, carRepoInterface) => {
    const response = await carRepoInterface.updateCar(carId, carData);
    return response;
};
exports.updateCar = updateCar;
const carBasedOnRole = async (role, carRepoInterface) => {
    const response = await carRepoInterface.carBasedOnrole(role);
    return response;
};
exports.carBasedOnRole = carBasedOnRole;
const carPartialUpdate = async (data, carRepoInterface) => {
    const response = await carRepoInterface.carPartialUpdate(data);
    if (data && data.offer && response) {
        console.log("offer updating");
        __1.io.emit('offerUpdate', {
            message: `The offer for the car ${response.name} has been updated: We are excited to inform you that the latest offer for the ${response.name} includes a discount of ${response.offer?.discount || 'No description provided'}. Take advantage of this special deal and enjoy great savings on your rental!`,
            car: response.name,
            carImage: response.thumbnailImg
        });
    }
    console.log("no offer found");
    return response;
};
exports.carPartialUpdate = carPartialUpdate;
const carPagination = async (page, limit, carRepoInterface) => {
    const response = await carRepoInterface.carPagination(page, limit);
    return response;
};
exports.carPagination = carPagination;
