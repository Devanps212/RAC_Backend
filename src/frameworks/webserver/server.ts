import { Server } from "http";
import configFile from "../../config";

const serverConfig = (server: Server)=>{
    const startServer = ()=>{
        server.listen(configFile.PORT, ()=>{
            console.log(`Server runnign on PORT: ${configFile.PORT}`)
        })
    }
    startServer()
}

export default  serverConfig