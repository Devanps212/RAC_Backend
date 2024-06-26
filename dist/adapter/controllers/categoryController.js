"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const category_1 = require("../../app/use_case/category/category");
const categoryController = (categoryInterface, categoryImpl, categoryModel) => {
    const categoryDatabase = categoryInterface(categoryImpl(categoryModel));
    const categoryCreation = (0, express_async_handler_1.default)(async (req, res) => {
        const { name, description } = req?.body;
        const categoryExist = await (0, category_1.checkCateg)(categoryDatabase, name);
        if (categoryExist === null) {
            const addCategory = await (0, category_1.createCateg)(name, description, categoryDatabase);
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
    });
    const editsCategory = (0, express_async_handler_1.default)(async (req, res) => {
        const { formData } = req?.body;
        const EditCategory = await (0, category_1.editCategory)(formData, categoryDatabase);
        res.json({
            status: EditCategory?.status,
            message: "category edited successfully",
        });
    });
    const list = (0, express_async_handler_1.default)(async (req, res) => {
        const { categoryId } = req?.body;
        const categList = await (0, category_1.listCateg)(categoryId, categoryDatabase);
        res.json({
            status: "success",
            message: "category listed"
        });
    });
    const Unlist = (0, express_async_handler_1.default)(async (req, res) => {
        const { categoryId } = req?.body;
        const categUnlist = await (0, category_1.unlistCateg)(categoryId, categoryDatabase);
        res.json({
            status: "success",
            message: "category Unlisted"
        });
    });
    const categoryRetrieve = (0, express_async_handler_1.default)(async (req, res) => {
        const name = req.query.name;
        const categoryId = req.query.categoryId;
        const categoryExist = await (0, category_1.checkCateg)(categoryDatabase, name, categoryId);
        res.json({
            status: "success",
            message: "category retreived successfully",
            categoryExist
        });
    });
    const getAllCategory = (0, express_async_handler_1.default)(async (req, res) => {
        const allData = await (0, category_1.getAllCateg)(categoryDatabase);
        res.json({
            status: "success",
            message: "Data retreived successfully",
            allData
        });
    });
    return {
        categoryCreation,
        editsCategory, list,
        Unlist,
        categoryRetrieve,
        getAllCategory
    };
};
exports.default = categoryController;
