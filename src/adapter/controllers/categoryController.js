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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const category_1 = require("../../app/use_case/category/category");
const categoryController = (categoryInterface, categoryImpl, categoryModel) => {
    const categoryDatabase = categoryInterface(categoryImpl(categoryModel));
    const categoryCreation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description } = req === null || req === void 0 ? void 0 : req.body;
        const categoryExist = yield (0, category_1.checkCateg)(categoryDatabase, name);
        if (categoryExist === null) {
            console.log("vrwating a new category");
            const addCategory = yield (0, category_1.createCateg)(name, description, categoryDatabase);
            res.json({
                status: "success",
                message: "Category created",
                addCategory,
            });
        }
        else {
            res.status(400).json({
                status: "error",
                message: "Category already exists",
            });
        }
    }));
    const editsCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { formData } = req === null || req === void 0 ? void 0 : req.body;
        const EditCategory = yield (0, category_1.editCategory)(formData, categoryDatabase);
        res.json({
            status: EditCategory === null || EditCategory === void 0 ? void 0 : EditCategory.status,
            message: "category edited successfully",
        });
    }));
    const list = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req === null || req === void 0 ? void 0 : req.body;
        const categList = yield (0, category_1.listCateg)(categoryId, categoryDatabase);
        res.json({
            status: "success",
            message: "category listed"
        });
    }));
    const Unlist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req === null || req === void 0 ? void 0 : req.body;
        const categUnlist = yield (0, category_1.unlistCateg)(categoryId, categoryDatabase);
        res.json({
            status: "success",
            message: "category Unlisted"
        });
    }));
    const categoryRetrieve = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const name = req.query.name;
        const categoryId = req.query.categoryId;
        const categoryExist = yield (0, category_1.checkCateg)(categoryDatabase, name, categoryId);
        res.json({
            status: "success",
            message: "category retreived successfully",
            categoryExist
        });
    }));
    const getAllCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allData = yield (0, category_1.getAllCateg)(categoryDatabase);
        res.json({
            status: "success",
            message: "Data retreived successfully",
            allData
        });
    }));
    return {
        categoryCreation,
        editsCategory, list,
        Unlist,
        categoryRetrieve,
        getAllCategory
    };
};
exports.default = categoryController;
