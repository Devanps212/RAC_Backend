import { Application } from "express"
import userAuthentication from "./userAuth"
import { adminAuthentication } from "./adminAuth"
import categoryRoute from "./categoryRoute"
import { carRoute } from "./carRouter"
import adminUserRouter from "./adminUser"
import partnerRoute from "./partnerRoutes/partnerRoute"
import { bookingRoute } from "./bookingRoute"

const routes = (app: Application)=>{
    app.use('/api/user-auth',  userAuthentication())
    app.use('/api/admin-auth', adminAuthentication())
    app.use('/api/admin', adminUserRouter())
    app.use('/api/category', categoryRoute())
    app.use('/api/cars', carRoute())
    app.use('/api/partner', partnerRoute())
    app.use('/api/booking', bookingRoute())
}
export default routes