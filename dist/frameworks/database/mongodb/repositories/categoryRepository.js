"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const category_1 = require("../../../../entities/category");
const categoryRepository = (model) => {
    const CategoryEntity = new category_1.categoryEntity(model);
    const createCategory = async (categoryData) => {
        const createCateg = await CategoryEntity.createCategory(categoryData);
        return createCateg;
    };
    const editCateg = async (categoryData) => {
        console.log("reached repository edit");
        const editCateg = await CategoryEntity.editCategory(categoryData);
        return editCateg;
    };
    const unListCateg = async (categoryId) => {
        const unListedCateg = await CategoryEntity.unListCategory(categoryId);
        return unListedCateg;
    };
    const listCateg = async (categoryId) => {
        const unListedCateg = await CategoryEntity.ListCategory(categoryId);
        return unListedCateg;
    };
    const checkCategory = async (name, categoryId) => {
        console.log(name, categoryId);
        if (name !== undefined && categoryId === undefined) {
            console.log("checking name");
            const categoryCheck = await CategoryEntity.CheckCategory(name, undefined);
            return categoryCheck;
        }
        else if (name === undefined && categoryId !== undefined) {
            console.log("checking id");
            const categoryCheck = await CategoryEntity.CheckCategory(undefined, categoryId);
            return categoryCheck;
        }
    };
    const getAllCateg = async () => {
        const resposne = await CategoryEntity.getAllCategories();
        return resposne;
    };
    return { createCategory, editCateg, listCateg, unListCateg, checkCategory, getAllCateg };
};
exports.categoryRepository = categoryRepository;
