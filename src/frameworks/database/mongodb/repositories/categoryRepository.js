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
exports.categoryRepository = void 0;
const category_1 = require("../../../../entities/category");
const categoryRepository = (model) => {
    const CategoryEntity = new category_1.categoryEntity(model);
    const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        const createCateg = yield CategoryEntity.createCategory(categoryData);
        return createCateg;
    });
    const editCateg = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("reached repository edit");
        const editCateg = yield CategoryEntity.editCategory(categoryData);
        return editCateg;
    });
    const unListCateg = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        const unListedCateg = yield CategoryEntity.unListCategory(categoryId);
        return unListedCateg;
    });
    const listCateg = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        const unListedCateg = yield CategoryEntity.ListCategory(categoryId);
        return unListedCateg;
    });
    const checkCategory = (name, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(name, categoryId);
        if (name !== undefined && categoryId === undefined) {
            console.log("checking name");
            const categoryCheck = yield CategoryEntity.CheckCategory(name, undefined);
            return categoryCheck;
        }
        else if (name === undefined && categoryId !== undefined) {
            console.log("checking id");
            const categoryCheck = yield CategoryEntity.CheckCategory(undefined, categoryId);
            return categoryCheck;
        }
    });
    const getAllCateg = () => __awaiter(void 0, void 0, void 0, function* () {
        const resposne = yield CategoryEntity.getAllCategories();
        return resposne;
    });
    return { createCategory, editCateg, listCateg, unListCateg, checkCategory, getAllCateg };
};
exports.categoryRepository = categoryRepository;
