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
exports.passwordReset = exports.findUsersForConversation = exports.updateUser = exports.locationFinder = void 0;
const appErrors_1 = __importDefault(require("../../../utils/appErrors"));
const httpTypes_1 = require("../../../types/httpTypes");
const config_1 = __importDefault(require("../../../config"));
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = require("mongoose");
const locationFinder = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Data ===>", data);
        const response = yield axios_1.default.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${data}&access_token=${config_1.default.LOCATION_ACCESS_TOKEN}&session_token=ce8adf6d-f635-415e-ad83-7597a752bdfc&language=en&limit=10&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi%2Cstreet%2Ccategory&proximity=76.3218144%2C9.9380786`);
        return response.data.suggestions;
    }
    catch (error) {
        console.log(error);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
exports.locationFinder = locationFinder;
const updateUser = (data, userInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield userInterface.userUpdate(data);
    return response;
});
exports.updateUser = updateUser;
const findUsersForConversation = (id, userInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield userInterface.findUsersForConversation(id);
    return response;
});
exports.findUsersForConversation = findUsersForConversation;
const passwordReset = (password, userId, authInterface, userInterface) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashPassword = yield authInterface.encryptPassword(password);
        if (!hashPassword) {
            throw new appErrors_1.default('password checking bcryption failed Please try again', httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
        }
        const data = {
            _id: new mongoose_1.Types.ObjectId(userId),
            password: hashPassword
        };
        const updateUser = yield userInterface.userUpdate(data);
        return updateUser;
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
exports.passwordReset = passwordReset;
