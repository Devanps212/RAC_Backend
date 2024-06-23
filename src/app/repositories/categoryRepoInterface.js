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
exports.categoryRepoInterface = void 0;
const categoryRepoInterface = (repository) => {
    const createCateg = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.createCategory(categoryData);
    });
    const editCateg = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("reached interface edit");
        return yield repository.editCateg(categoryData);
    });
    const listCateg = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.listCateg(categoryId);
    });
    const unlistCateg = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.unListCateg(categoryId);
    });
    const CategoryExist = (name, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("name : ", name, "id : ", categoryId);
        if (name !== undefined && categoryId === undefined) {
            console.log("checking with name");
            const categoryCheck = yield repository.checkCategory(name, undefined);
            return categoryCheck;
        }
        else if (categoryId !== undefined && name === undefined) {
            console.log("checking with id");
            const categoryCheck = yield repository.checkCategory(undefined, categoryId);
            return categoryCheck;
        }
        else {
            console.log("nothing found");
            return null;
        }
    });
    const getAllCategory = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("fetching categories");
        const result = yield repository.getAllCateg();
        return result;
    });
    return { createCateg, editCateg, listCateg, unlistCateg, CategoryExist, getAllCategory };
};
exports.categoryRepoInterface = categoryRepoInterface;
//now create controller
