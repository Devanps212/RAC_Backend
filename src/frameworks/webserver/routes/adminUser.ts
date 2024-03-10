import { usersModel } from "../../database/mongodb/models/userModel";
import { userdbRepository } from "../../../app/repositories/userDbrepository";
import { userRepository } from "../../database/mongodb/repositories/userRepositoryMongo";
import adminUserController from "../../../adapter/controllers/adminUserController";
import express from'express'

const adminUserRouter = ()=>{

    const controllers = adminUserController(usersModel, userdbRepository, userRepository )
    const userAdminRouter = express.Router()

    userAdminRouter.get('/allUsers', controllers.getAllUsers)
    userAdminRouter.patch('/UBUser', controllers.unblockBlockUser)
    userAdminRouter.get('/userFind', controllers.findOneuser)

    return userAdminRouter
}

export default adminUserRouter