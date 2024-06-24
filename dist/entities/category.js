"use strict";
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
    async createCategory(categoryData) {
        try {
            const category = await this.model.create(categoryData);
            return category;
        }
        catch (error) {
            console.error("Error creating category:", error.message);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editCategory(categoryData) {
        try {
            console.log("reached interface edit");
            const { _id, name, description } = categoryData;
            const existingCategory = await this.model.findOne({ name });
            if (existingCategory) {
                console.log("Category with the same name already exists");
                throw new appErrors_1.default('Category with the same name already exists', httpTypes_1.HttpStatus.BAD_REQUEST);
            }
            const editCateg = await this.model.updateOne({ _id: _id }, { $set: { name, description } });
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
    }
    async unListCategory(categoryId) {
        try {
            console.log("categoryId recieved : ", categoryId);
            const categoryList = await this.model.updateOne({ _id: categoryId }, { $set: { isListed: false } });
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
    }
    async ListCategory(categoryId) {
        try {
            const categoryList = await this.model.updateOne({ _id: categoryId }, { isListed: true });
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
    }
    async CheckCategory(name, categoryId) {
        try {
            let checkUser;
            console.log("came to entity");
            if (name !== undefined && categoryId === undefined) {
                console.log("checking category with name in entity ");
                const checkname = new RegExp(`^${name}$`, 'i');
                checkUser = await this.model.findOne({ name: checkname });
                console.log(checkUser);
            }
            if (name === undefined && categoryId !== undefined) {
                console.log("checking category with id in entity ");
                checkUser = await this.model.findOne({ _id: categoryId });
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
    }
    async getAllCategories() {
        try {
            console.log("category found");
            const allCateg = await this.model.find({});
            return allCateg;
        }
        catch (error) {
            console.log(error.message);
            throw new appErrors_1.default(error.message, httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.categoryEntity = categoryEntity;
