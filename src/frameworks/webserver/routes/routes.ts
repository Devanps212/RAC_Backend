import { Application } from "express"
import userAuthentication from "./userAuth"
import { adminAuthentication } from "./adminAuth"
import categoryRoute from "./categoryRoute"

const routes = (app: Application)=>{
    app.use('/api/user-auth',  userAuthentication())
    app.use('/api/admin-auth', adminAuthentication())
    app.use('/api/category', categoryRoute())
}
export default routes