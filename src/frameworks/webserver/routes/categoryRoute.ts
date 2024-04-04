import categoryController from "../../../adapter/controllers/categoryController"
import { categoryRepoInterface } from "../../../app/repositories/categoryRepoInterface"
import { categoryRepository } from "../../database/mongodb/repositories/categoryRepository"
import { categoryModel } from "../../database/mongodb/models/categoryModel"
import { authentication, RoleAuthMiddleware } from "../middlewares/authenticationMidddleware"
import express from 'express'

const categoryRoute = ()=>{

    const AuthRoleMiddleware = RoleAuthMiddleware('admin')

    const router = express.Router()
    const controller = categoryController(categoryRepoInterface, categoryRepository, categoryModel)

    router.post('/createCateg', authentication, AuthRoleMiddleware,controller.categoryCreation)
    router.put('/updateCateg', authentication, AuthRoleMiddleware, controller.editsCategory)
    router.patch('/listCateg', authentication, AuthRoleMiddleware, controller.list)
    router.patch('/unlistCateg', authentication, AuthRoleMiddleware, controller.Unlist)
    router.get('/categoryOne', authentication, AuthRoleMiddleware, controller.categoryRetrieve)
    router.get('/getCategoryAll', authentication, AuthRoleMiddleware, controller.getAllCategory)
    router.put('/editCateg', authentication, AuthRoleMiddleware, controller.editsCategory)
    return router
}
export default categoryRoute