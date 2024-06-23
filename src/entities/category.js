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
exports.categoryEntity = void 0;
const httpTypes_1 = require("../types/httpTypes");
const appErrors_1 = __importDefault(require("../utils/appErrors"));
class categoryEntity {
    constructor(model) {
        this.model = model;
    }
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.model.create(categoryData);
                return category;
            }
            catch (error) {
                console.error("Error creating category:", error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    editCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached interface edit");
                const { _id, name, description } = categoryData;
                const existingCategory = yield this.model.findOne({ name });
                if (existingCategory) {
                    console.log("Category with the same name already exists");
                    throw new appErrors_1.default('Category with the same name already exists', httpTypes_1.HttpStatus.BAD_REQUEST);
                }
                const editCateg = yield this.model.updateOne({ _id: _id }, { $set: { name, description } });
                if (editCateg.matchedCount > 0 && editCateg.modifiedCount > 0) {
                    console.log("Category edited");
                    return { status: "success" };
                }
                else if (editCateg.matchedCount > 0 && editCateg.modifiedCount === 0) {
                    console.log("No changes made to the category");
                    throw new appErrors_1.default('Please make some changes for edit', httpTypes_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    console.log("No category found for the given ID");
                    throw new appErrors_1.default('no category found', httpTypes_1.HttpStatus.BAD_REQUEST);
                }
            }
            catch (error) {
                console.error("Error editing category name:", error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    unListCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("categoryId recieved : ", categoryId);
                const categoryList = yield this.model.updateOne({ _id: categoryId }, { $set: { isListed: false } });
                if (categoryList.modifiedCount > 0) {
                    console.log("category updated");
                    return { status: "success" };
                }
                console.log(categoryList);
                console.log("cant unlist category");
                throw new appErrors_1.default("can't unlist the category", httpTypes_1.HttpStatus.NOT_MODIFIED);
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    ListCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryList = yield this.model.updateOne({ _id: categoryId }, { isListed: true });
                if (categoryList.modifiedCount > 0) {
                    console.log("category updated");
                    return { status: "success" };
                }
                console.log("cant list category");
                throw new appErrors_1.default("error listing category", httpTypes_1.HttpStatus.NOT_MODIFIED);
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    CheckCategory(name, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let checkUser;
                console.log("came to entity");
                if (name !== undefined && categoryId === undefined) {
                    console.log("checking category with name in entity ");
                    const checkname = new RegExp(`^${name}$`, 'i');
                    checkUser = yield this.model.findOne({ name: checkname });
                    console.log(checkUser);
                }
                if (name === undefined && categoryId !== undefined) {
                    console.log("checking category with id in entity ");
                    checkUser = yield this.model.findOne({ _id: categoryId });
                    console.log(checkUser);
                }
                console.log("check use  in entity :", checkUser);
                if (checkUser === null) {
                    console.log("Category does not exist");
                    return null;
                }
                console.log("found category : ", checkUser);
                return checkUser;
            }
            catch (error) {
                console.error(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("category found");
                const allCateg = yield this.model.find({});
                return allCateg;
            }
            catch (error) {
                console.log(error.message);
                throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.categoryEntity = categoryEntity;
