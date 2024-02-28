import express from "express";
import { adminAuthController } from "../../../adapter/controllers/adminAuthController";
import { authService } from "../../services/authServices";
import { interfaceAuthService } from "../../../app/services/authServiceInterface"; 
import { adminDBRepository } from "../../../app/repositories/adminDBRepository";
import { adminRepositoryMDB } from "../../database/mongodb/repositories/adminRepositoryMDB";
import { adminsModel } from "../../database/mongodb/models/adminModel";


export const adminAuthentication = () =>{

    const router = express.Router()
    const controller = adminAuthController(adminRepositoryMDB, adminDBRepository, authService, interfaceAuthService, adminsModel)

    router.post('/login', controller.adminLogin)
    return router
}

