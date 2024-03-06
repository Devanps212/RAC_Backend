import { Application } from "express"
import userAuthentication from "./userAuth"
import { adminAuthentication } from "./adminAuth"
import categoryRoute from "./categoryRoute"
import { carRoute } from "./carRouter"

const routes = (app: Application)=>{
    app.use('/api/user-auth',  userAuthentication())
    app.use('/api/admin-auth', adminAuthentication())
    app.use('/api/category', categoryRoute())
    app.use('/api/cars', carRoute())
}
export default routes