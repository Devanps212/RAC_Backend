import { Application } from "express"
import userAuthentication from "./userAuth"

const routes = (app: Application)=>{
    app.use('/api/user-auth',  userAuthentication())
}
export default routes