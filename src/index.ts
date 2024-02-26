import express, {Application, NextFunction} from 'express'
import http from 'http'
import connectDb from './frameworks/database/mongodb/connection'
import expressConfig from './frameworks/webserver/express'
import errorHandling from './frameworks/webserver/middlewares/errorHandling'
import AppError from './utils/appErrors'
import serverConfig from './frameworks/webserver/server'
import routes from './frameworks/webserver/routes/routes'


const app:Application = express()
const server = http.createServer(app)



connectDb()

expressConfig(app)

routes(app)


app.use(errorHandling)

app.all('*', (req, res, next)=>{
    next(new AppError('Not found', 404))
})
serverConfig(server)

