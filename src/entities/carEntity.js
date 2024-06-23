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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carEntity = void 0;
const mongoose_1 = require("mongoose");
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class carEntity {
    constructor(model) {
        this.model = model;
    }
    addCar(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carCreate = yield this.model.create(carData);
                if (carCreate) {
                    console.log("car created");
                    return carCreate.toObject();
                }
                else {
                    throw new appErrors_1.default('car creation failed', httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
                }
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    editCar(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached car Enitity");
            console.log("reached car Enitity");
            try {
                const { _id, deletedExteriorIndex, deletedInteriorIndex, interior, exterior, thumbnailImg, seats, comments } = carData, restData = __rest(carData, ["_id", "deletedExteriorIndex", "deletedInteriorIndex", "interior", "exterior", "thumbnailImg", "seats", "comments"]);
                const PictureUpdate = yield this.model.findOne({ _id });
                let shouldUpdateMongo = false;
                if (deletedExteriorIndex && PictureUpdate) {
                    console.log("exterior after update:", PictureUpdate);
                    console.log("delted exterior :", deletedExteriorIndex);
                    if (exterior && exterior.length === 1) {
                        PictureUpdate.exterior[parseInt(deletedExteriorIndex)] = exterior[0];
                        shouldUpdateMongo = true;
                    }
                }
                if (deletedInteriorIndex && PictureUpdate) {
                    console.log("Interior before update:", PictureUpdate);
                    console.log("delyted Interior : ", deletedInteriorIndex);
                    if (interior && interior.length === 1) {
                        PictureUpdate.interior[parseInt(deletedInteriorIndex)] = interior[0];
                        shouldUpdateMongo = true;
                    }
                }
                if (deletedInteriorIndex || deletedExteriorIndex) {
                    if (interior && interior.length > 1 && PictureUpdate) {
                        PictureUpdate.interior = interior;
                        shouldUpdateMongo = true;
                    }
                    if (exterior && exterior.length > 1 && PictureUpdate) {
                        PictureUpdate.exterior = exterior;
                        shouldUpdateMongo = true;
                    }
                }
                if (thumbnailImg && PictureUpdate) {
                    PictureUpdate.thumbnailImg = thumbnailImg;
                    shouldUpdateMongo = true;
                }
                if (seats && PictureUpdate) {
                    PictureUpdate.seats = parseInt(seats);
                    shouldUpdateMongo = true;
                }
                if (PictureUpdate) {
                    const updatedDocument = yield PictureUpdate.save();
                    const dataSave = yield this.model.updateOne({ _id }, { $set: restData });
                    if ((updatedDocument !== null || (dataSave !== undefined && dataSave.matchedCount > 0 && dataSave.modifiedCount > 0))) {
                        const carDetails = yield this.model.findOne({ _id });
                        console.log("car updated");
                        return { status: "success" };
                    }
                    else if (dataSave !== undefined && dataSave.matchedCount > 0 && dataSave.modifiedCount === 0 && updatedDocument === null) {
                        throw new appErrors_1.default('Please edit something to change', httpTypes_1.HttpStatus.NOT_MODIFIED);
                    }
                    else {
                        throw new appErrors_1.default('car not found or update failed', httpTypes_1.HttpStatus.NOT_FOUND);
                    }
                }
                else {
                    console.log("No need to update MongoDB");
                    return { status: "success" };
                }
            }
            catch (error) {
                throw new appErrors_1.default('Internal server error', httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    findCar(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let allDetails;
                if (carData === 'all') {
                    allDetails = yield this.model.find().populate('category').populate('addedById');
                    return allDetails.map((car) => car.toObject());
                }
                else if (mongoose_1.Types.ObjectId.isValid(carData)) {
                    allDetails = yield this.model.findOne({ _id: carData }).populate('comments.userId').populate('category');
                    if (allDetails) {
                        return allDetails.toObject();
                    }
                }
                else if (carData === 'partnerCars') {
                    allDetails = yield this.model.find({ owner: 'Partner' }).populate('category');
                    if (allDetails) {
                        return allDetails.map((car) => car.toObject());
                    }
                }
                else {
                    throw new appErrors_1.default('Car not found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return null;
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteCar(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("carU=Id : ", carId);
                const carDelete = yield this.model.deleteOne({ _id: carId });
                if (carDelete.deletedCount > 0) {
                    return { status: 'success', message: 'car deletd successfully' };
                }
                else {
                    throw new appErrors_1.default("can't delete car", httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
                }
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    viewCarDetails(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("carId for view details :", carId);
                const details = yield this.model.findOne({ _id: carId });
                if (!details) {
                    return { message: "not found" };
                }
                return details.toObject();
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    checkCarByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield this.model.findOne({ name: name });
                if (check) {
                    throw new appErrors_1.default('car exist', httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
                }
                else {
                    console.log("car not founnd");
                    return { message: "Car not found" };
                }
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    carUpdater(carId, dataUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const car = yield this.model.findById(carId);
                if (!car) {
                    throw new Error('Car not found');
                }
                if (dataUpdate && Object.keys(dataUpdate).length > 0) {
                    Object.assign(car, dataUpdate);
                    yield car.save();
                    return { message: "car Updated SuccessFully", carData: car.toObject() };
                }
                else {
                    return { message: "updation failed", carData: null };
                }
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    carBasedOnRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cars = yield this.model.find({ owner: role });
                if (cars === null) {
                    throw new appErrors_1.default('no cars found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return cars.map(car => car.toObject());
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    carPartialUpdate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data._id) {
                    throw new appErrors_1.default('Car ID is required', httpTypes_1.HttpStatus.BAD_REQUEST);
                }
                const car = yield this.model.findByIdAndUpdate(data._id, { $set: data }, { new: true, runValidators: true }).lean();
                if (!car) {
                    throw new appErrors_1.default('No car found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                const updatedCar = yield this.model.findById({ _id: data._id });
                if (!updatedCar) {
                    throw new appErrors_1.default("no car updated", httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return updatedCar.toObject();
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    carPagination(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cars = yield this.model.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('category')
                    .exec();
                console.log("cars from enity : ", cars);
                const totalCount = yield this.model.countDocuments();
                return {
                    cars: cars.map(car => car.toObject()),
                    totalCount: totalCount
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.carEntity = carEntity;
