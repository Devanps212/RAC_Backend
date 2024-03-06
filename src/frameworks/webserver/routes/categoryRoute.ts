import categoryController from "../../../adapter/controllers/categoryController"
import { categoryRepoInterface } from "../../../app/repositories/categoryRepoInterface"
import { categoryRepository } from "../../database/mongodb/repositories/categoryRepository"
import { categoryModel } from "../../database/mongodb/models/categoryModel"
import express from 'express'

const categoryRoute = ()=>{

    const router = express.Router()
    const controller = categoryController(categoryRepoInterface, categoryRepository, categoryModel)

    router.post('/createCateg', controller.categoryCreation)
    router.put('/updateCateg', controller.editsCategory)
    router.patch('/listCateg', controller.list)
    router.patch('/unlistCateg', controller.Unlist)
    router.get('/categoryOne', controller.categoryRetrieve)
    router.get('/getCategoryAll', controller.getAllCategory)
    router.put('/editCateg', controller.editsCategory)
    return router
}
export default categoryRoute