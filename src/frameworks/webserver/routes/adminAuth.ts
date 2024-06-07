import express from "express";
import { adminAuthController } from "../../../adapter/controllers/adminAuthController";
import { authService } from "../../services/authServices";
import { interfaceAuthService } from "../../../app/services/authServiceInterface"; 
import { adminDBRepository } from "../../../app/repositories/adminDBRepository";
import { adminRepositoryMDB } from "../../database/mongodb/repositories/adminRepositoryMDB";
import { adminsModel } from "../../database/mongodb/models/adminModel";
import { AdminAuthentication } from "../middlewares/adminAuthMiddleware";
import upload from "../../../app/services/multerService";


export const adminAuthentication = () =>{

    const router = express.Router()
    const controller = adminAuthController(adminRepositoryMDB, adminDBRepository, authService, interfaceAuthService, adminsModel)

    router.post('/login', controller.adminLogin)
    router.get('/findOne', AdminAuthentication, controller.findAdminOne)
    router.patch('/updateAdmin',  AdminAuthentication, upload.fields([{ name: 'profilePic', maxCount: 1 }]), controller.adminUpdate);
    return router
}

