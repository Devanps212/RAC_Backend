"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCateg = exports.checkCateg = exports.listCateg = exports.unlistCateg = exports.editCategory = exports.createCateg = void 0;
const createCateg = async (name, description, categoryDBinterface) => {
    const categoryData = { name, description };
    console.log("category data :", categoryData);
    const create = await categoryDBinterface.createCateg(categoryData);
    return create;
};
exports.createCateg = createCateg;
const editCategory = async (categoryData, categoryDBinterface) => {
    const editCateg = await categoryDBinterface.editCateg(categoryData);
    return editCateg;
};
exports.editCategory = editCategory;
const unlistCateg = async (categoryId, categoryDBinterface) => {
    const unlist = await categoryDBinterface.unlistCateg(categoryId);
    return unlist;
};
exports.unlistCateg = unlistCateg;
const listCateg = async (categoryId, categoryDBinterface) => {
    const list = await categoryDBinterface.listCateg(categoryId);
    return list;
};
exports.listCateg = listCateg;
const checkCateg = async (categoryDBinterface, name, categoryId) => {
    const categ = await categoryDBinterface.CategoryExist(name, categoryId);
    return categ;
};
exports.checkCateg = checkCateg;
const getAllCateg = async (categoryDBinterface) => {
    const result = await categoryDBinterface.getAllCategory();
    return result;
};
exports.getAllCateg = getAllCateg;
