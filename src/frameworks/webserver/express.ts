import express, { Application, NextFunction } from "express";
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import bodyparser from 'body-parser'
import cors from 'cors'
import configFile from "../../config";
import session, {MemoryStore} from "express-session";

const expressConfig = (app:Application)=>{
    //Necessary Middlewares

    const corsOptions = {
        origin : "*",
        methods:["GET", "POST", "DELETE", "PUT", "PATCH"],
        exposedHeaders: [
            "Cross-Origin-Opener-Policy",
            "Cross-Origin-Resource-Policy",
            "Access-Control-Allow-Origin",
          ],
    }
    console.log("session key :", configFile.SESSION_KEY)
    const store = new MemoryStore()
    app.use(session({
        secret: configFile.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
            maxAge: 86400000
          },
    }))
    app.use(express.static(path.join(__dirname,'..', 'uploads')))
    app.use(cors(corsOptions))
    app.use(express.json())
    const dirname =__dirname
    const pathBuild = path.join(dirname, '/Frontend/src/assets')
    console.log(pathBuild)
    app.use(express.static(pathBuild))
    app.use(express.urlencoded({limit: "10mb", extended:true}))
    app.use(bodyparser.json({limit: "10mb"}))
    app.use(bodyparser.urlencoded({extended:true}))
    app.use(helmet({xssFilter:true}))
    app.use(morgan('dev'))

    

    app.use((req, res, next:NextFunction)=>{
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        next()
    })
    
    
    
    
}

export default expressConfig