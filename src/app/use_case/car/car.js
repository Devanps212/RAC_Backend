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
exports.carPagination = exports.carPartialUpdate = exports.carBasedOnRole = exports.updateCar = exports.checkCar = exports.viewCarDetails = exports.findCar = exports.deleteCar = exports.editCar = exports.createCar = void 0;
const createCar = (carData, carRepInterface, authInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Data received");
    if (carData.addedById) {
        console.log("reached edit car");
        const tokenData = yield authInterface.tokenVerification(carData.addedById);
        if (typeof tokenData === 'object' && tokenData.hasOwnProperty('payload')) {
            console.log(tokenData);
            const payload = tokenData.payload;
            console.log("Token payload:", payload);
            carData.addedById = payload;
        }
    }
    const carCreate = yield carRepInterface.createCar(carData);
    return carCreate;
});
exports.createCar = createCar;
const editCar = (carData, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reached edit car");
    const carEdit = yield carRepoInterface.editCar(carData);
    return carEdit;
});
exports.editCar = editCar;
const deleteCar = (carId, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data receieved from edit :", carId);
    const carDelete = yield carRepoInterface.deleteCar(carId);
    return carDelete;
});
exports.deleteCar = deleteCar;
const findCar = (carData, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const carFind = yield carRepoInterface.findCar(carData);
    return carFind;
});
exports.findCar = findCar;
const viewCarDetails = (carId, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data receieved from edit :", carId);
    const carView = yield carRepoInterface.viewCar(carId);
    return carView;
});
exports.viewCarDetails = viewCarDetails;
const checkCar = (name, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("car checking");
    const carExist = yield carRepoInterface.checkCar(name);
    return carExist;
});
exports.checkCar = checkCar;
// export const statusUpdater = async(carId: string, carRepoInterface : ReturnType<carInterfaceType>)=>{
//     const response = await carRepoInterface
//     return response 
// }
const updateCar = (carId, carData, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield carRepoInterface.updateCar(carId, carData);
    return response;
});
exports.updateCar = updateCar;
const carBasedOnRole = (role, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield carRepoInterface.carBasedOnrole(role);
    return response;
});
exports.carBasedOnRole = carBasedOnRole;
const carPartialUpdate = (data, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield carRepoInterface.carPartialUpdate(data);
    return response;
});
exports.carPartialUpdate = carPartialUpdate;
const carPagination = (page, limit, carRepoInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield carRepoInterface.carPagination(page, limit);
    return response;
});
exports.carPagination = carPagination;
