import { Response, Request, NextFunction } from "express";
import AppError from "../../../utils/appErrors";

const errorHandling = (err:AppError, req:Request, res:Response, next:NextFunction )=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(err.statusCode === 404)
    {
        return res.status(err.statusCode).json({errors: err.status, errorMessage: err.message})

    }
    else
    {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
}
export default errorHandling