import { Application } from "express"
import express from 'express'
import { Request, Response } from "express"
import userAuthentication from "./userAuth"
import { adminAuthentication } from "./adminAuth"
import categoryRoute from "./categoryRoute"
import { carRoute } from "./carRouter"
import adminUserRouter from "./adminUser"
import partnerRoute from "./partnerRoutes/partnerRoute"
import { bookingRoute } from "./bookingRoute"
import { couponRoute } from "./couponRouter"
import conversationRoute from "./conversationRoute"
// import messageRoute from "./messageRoute"

const routes = (app: Application)=>{

    const router = express.Router()
    app.use('/api/user-auth',  userAuthentication())
    app.use('/api/admin-auth', adminAuthentication())
    app.use('/api/admin', adminUserRouter())
    app.use('/api/category', categoryRoute())
    app.use('/api/cars', carRoute())
    app.use('/api/coupon', couponRoute())
    app.use('/api/partner', partnerRoute())
    app.use('/api/booking', bookingRoute())
    app.use('/api/messenger-conversation', conversationRoute())
    // app.use('/api/messenger-message', messageRoute())

}
export default routes