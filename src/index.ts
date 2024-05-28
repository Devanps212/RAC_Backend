import express, {Application, NextFunction} from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'


import connectDb from './frameworks/database/mongodb/connection'
import expressConfig from './frameworks/webserver/express'
import errorHandling from './frameworks/webserver/middlewares/errorHandling'
import AppError from './utils/appErrors'
import serverConfig from './frameworks/webserver/server'
import routes from './frameworks/webserver/routes/routes'
import configFile from './config'
import socketConfig from './frameworks/websocket/socket'

const app:Application = express()
const server = http.createServer(app)


app.use(cors())

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

socketConfig(io)

connectDb()

expressConfig(app)

routes(app)


app.use(errorHandling)

app.all('*', (req, res, next: NextFunction)=>{
    next(new AppError('Not found', 404))
})
serverConfig(server)

