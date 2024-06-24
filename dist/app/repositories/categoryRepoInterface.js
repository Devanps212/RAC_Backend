"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepoInterface = void 0;
const categoryRepoInterface = (repository) => {
    const createCateg = async (categoryData) => {
        return await repository.createCategory(categoryData);
    };
    const editCateg = async (categoryData) => {
        console.log("reached interface edit");
        return await repository.editCateg(categoryData);
    };
    const listCateg = async (categoryId) => {
        return await repository.listCateg(categoryId);
    };
    const unlistCateg = async (categoryId) => {
        return await repository.unListCateg(categoryId);
    };
    const CategoryExist = async (name, categoryId) => {
        console.log("name : ", name, "id : ", categoryId);
        if (name !== undefined && categoryId === undefined) {
            console.log("checking with name");
            const categoryCheck = await repository.checkCategory(name, undefined);
            return categoryCheck;
        }
        else if (categoryId !== undefined && name === undefined) {
            console.log("checking with id");
            const categoryCheck = await repository.checkCategory(undefined, categoryId);
            return categoryCheck;
        }
        else {
            console.log("nothing found");
            return null;
        }
    };
    const getAllCategory = async () => {
        console.log("fetching categories");
        const result = await repository.getAllCateg();
        return result;
    };
    return { createCateg, editCateg, listCateg, unlistCateg, CategoryExist, getAllCategory };
};
exports.categoryRepoInterface = categoryRepoInterface;
//now create controller
