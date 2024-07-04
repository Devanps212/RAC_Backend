"use strict";
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
    async createUser(userData) {
        const newUser = await this.model.create(userData);
        return newUser;
    }
    async getUserByEmail(email) {
        try {
            const user = await this.model.findOne({ email }).exec();
            if (!user) {
                return null;
            }
            return user.toObject();
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async allUser() {
        try {
            const users = await this.model.find({}, { name: 1, email: 1, isActive: 1, profilePic: 1, mobile: 1 });
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
    }
    async blockUnblockUser(userId) {
        try {
            if (userId === undefined) {
                throw new appErrors_1.default('userId is Invalid', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            const user = await this.model.findOne({ _id: userId });
            if (user && user.isActive) {
                await this.model.findOneAndUpdate({ _id: userId }, { $set: { isActive: false } });
            }
            else {
                await this.model.findOneAndUpdate({ _id: userId }, { $set: { isActive: true } });
            }
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async userFindOne(userId) {
        try {
            const user = await this.model.findOne({ _id: userId }).lean();
            if (!user) {
                throw new appErrors_1.default('user not found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            return user;
        }
        catch (error) {
            console.error(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findUsers(id) {
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
    }
    async userUpdate(data) {
        try {
            const user = await this.model.findById({ _id: data._id });
            if (!user) {
                throw new appErrors_1.default('No user found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            if (Object.keys(data).length === 0) {
                throw new appErrors_1.default('No update data provided', httpTypes_1.HttpStatus.BAD_REQUEST);
            }
            Object.assign(user, data);
            await user.save();
            return user.toObject();
        }
        catch (error) {
            console.log(error);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllUsersFromMongo() {
        try {
            const users = await this.model.find();
            if (users == null) {
                throw new appErrors_1.default('no users found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            return users.map(user => user.toObject());
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findUsersForConversation(id) {
        try {
            const users = await this.model.find({ _id: { $ne: id } }).exec();
            if (users == null) {
                throw new appErrors_1.default('no users found', httpTypes_1.HttpStatus.NOT_FOUND);
            }
            return users.map(user => user.toObject());
        }
        catch (error) {
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.UserEntity = UserEntity;
