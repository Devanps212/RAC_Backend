import { usersModel } from "../../database/mongodb/models/userModel";
import { userdbRepository } from "../../../app/repositories/userDbrepository";
import { userRepository } from "../../database/mongodb/repositories/userRepositoryMongo";
import adminUserController from "../../../adapter/controllers/adminUserController";
import { authentication } from "../middlewares/authenticationMidddleware";
import { RoleAuthMiddleware } from "../middlewares/authenticationMidddleware";
import { bookingDBInterface } from "../../../app/repositories/bookingDBInterface";
import { bookingRepository } from "../../database/mongodb/repositories/bookingRepository";
import { bookingModel } from "../../database/mongodb/models/bookingModel";
import express from'express'

const adminMiddleware = RoleAuthMiddleware('admin')

const adminUserRouter = ()=>{

    const controllers = adminUserController(usersModel, userdbRepository, userRepository, bookingDBInterface, bookingRepository, bookingModel )
    const userAdminRouter = express.Router()

    userAdminRouter.get('/allUsers', authentication, adminMiddleware, controllers.getAllUsers)
    userAdminRouter.patch('/UBUser', authentication, adminMiddleware, controllers.unblockBlockUser)
    userAdminRouter.get('/userFind', authentication, adminMiddleware, controllers.findOneuser)

    return userAdminRouter
}

export default adminUserRouter