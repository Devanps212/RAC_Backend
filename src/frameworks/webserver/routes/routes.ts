import { Application } from "express"
import userAuthentication from "./userAuth"
import { adminAuthentication } from "./adminAuth"

const routes = (app: Application)=>{
    app.use('/api/user-auth',  userAuthentication())
    app.use('/api/admin', adminAuthentication())
}
export default routes