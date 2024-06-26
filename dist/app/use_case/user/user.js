"use strict";
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
const locationFinder = async (data) => {
    try {
        console.log("Data ===>", data);
        console.log(config_1.default.SEARCH_LOCATION);
        console.log(process.env);
        const response = await axios_1.default.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${data}&access_token=${config_1.default.LOCATION_ACCESS_TOKEN}&session_token=ce8adf6d-f635-415e-ad83-7597a752bdfc&language=en&limit=10&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi%2Cstreet%2Ccategory&proximity=76.3218144%2C9.9380786`);
        return response.data.suggestions;
    }
    catch (error) {
        console.log(error);
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.locationFinder = locationFinder;
const updateUser = async (data, userInterface) => {
    const response = await userInterface.userUpdate(data);
    return response;
};
exports.updateUser = updateUser;
const findUsersForConversation = async (id, userInterface) => {
    const response = await userInterface.findUsersForConversation(id);
    return response;
};
exports.findUsersForConversation = findUsersForConversation;
const passwordReset = async (password, userId, authInterface, userInterface) => {
    try {
        const hashPassword = await authInterface.encryptPassword(password);
        if (!hashPassword) {
            throw new appErrors_1.default('password checking bcryption failed Please try again', httpTypes_1.HttpStatus.NOT_IMPLEMENTED);
        }
        const data = {
            _id: new mongoose_1.Types.ObjectId(userId),
            password: hashPassword
        };
        const updateUser = await userInterface.userUpdate(data);
        return updateUser;
    }
    catch (error) {
        throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.passwordReset = passwordReset;
