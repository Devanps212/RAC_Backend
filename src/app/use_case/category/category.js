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
exports.getAllCateg = exports.checkCateg = exports.listCateg = exports.unlistCateg = exports.editCategory = exports.createCateg = void 0;
const createCateg = (name, description, categoryDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = { name, description };
    console.log("category data :", categoryData);
    const create = yield categoryDBinterface.createCateg(categoryData);
    return create;
});
exports.createCateg = createCateg;
const editCategory = (categoryData, categoryDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const editCateg = yield categoryDBinterface.editCateg(categoryData);
    return editCateg;
});
exports.editCategory = editCategory;
const unlistCateg = (categoryId, categoryDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const unlist = yield categoryDBinterface.unlistCateg(categoryId);
    return unlist;
});
exports.unlistCateg = unlistCateg;
const listCateg = (categoryId, categoryDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield categoryDBinterface.listCateg(categoryId);
    return list;
});
exports.listCateg = listCateg;
const checkCateg = (categoryDBinterface, name, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const categ = yield categoryDBinterface.CategoryExist(name, categoryId);
    return categ;
});
exports.checkCateg = checkCateg;
const getAllCateg = (categoryDBinterface) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categoryDBinterface.getAllCategory();
    return result;
});
exports.getAllCateg = getAllCateg;
