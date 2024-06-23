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
exports.UserEntity = void 0;
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class UserEntity {
    constructor(model) {
        this.model = model;
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.model.create(userData);
            return newUser;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ email }).exec();
                if (!user) {
                    return null;
                }
                return user.toObject();
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    allUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.model.find({}, { name: 1, email: 1, isActive: 1, profilePic: 1, mobile: 1 });
                const userDetails = users.map((user) => ({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive,
                    profilePic: user.profilePic,
                    mobile: user.mobile || undefined,
                }));
                return userDetails;
            }
            catch (error) {
                console.log(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userId === undefined) {
                    console.log("user not found");
                    throw new appErrors_1.default('userId is Invalid', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                const user = yield this.model.findOne({ _id: userId });
                if (user && user.isActive) {
                    yield this.model.findOneAndUpdate({ _id: userId }, { $set: { isActive: false } });
                }
                else {
                    yield this.model.findOneAndUpdate({ _id: userId }, { $set: { isActive: true } });
                }
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    userFindOne(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ _id: userId }).lean();
                if (!user) {
                    throw new appErrors_1.default('user not found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return user;
            }
            catch (error) {
                console.error(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    findUsers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.model.findOne({ _id: id });
                if (user !== null) {
                    return user;
                }
                else {
                    return { message: "not found" };
                }
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    userUpdate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("data : ", data);
                const user = yield this.model.findById({ _id: data._id });
                console.log("user found :", user);
                console.log("updating user");
                if (!user) {
                    console.log('no User Found');
                    throw new appErrors_1.default('No user found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                if (Object.keys(data).length === 0) {
                    console.log("nothing to update");
                    throw new appErrors_1.default('No update data provided', httpTypes_1.HttpStatus.BAD_REQUEST);
                }
                Object.assign(user, data);
                console.log("saving");
                yield user.save();
                return user.toObject();
            }
            catch (error) {
                console.log(error);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    findAllUsersFromMongo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.model.find();
                if (users == null) {
                    throw new appErrors_1.default('no users found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return users.map(user => user.toObject());
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    findUsersForConversation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("id found : ", id);
                const users = yield this.model.find({ _id: { $ne: id } }).exec();
                console.log("users length", users.length);
                if (users == null) {
                    throw new appErrors_1.default('no users found', httpTypes_1.HttpStatus.NOT_FOUND);
                }
                return users.map(user => user.toObject());
            }
            catch (error) {
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.UserEntity = UserEntity;
