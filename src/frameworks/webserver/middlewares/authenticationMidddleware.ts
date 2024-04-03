import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";


export const authenticationPartner = (req:Request, res:Response, next:NextFunction)=>{
    const AuthHeader = req.headers['Authorization']
    if(typeof AuthHeader === 'string')
    {
        if(AuthHeader.startsWith('Bearer '))
        {
            const token = AuthHeader.substring(7)
            console.log(token)
            next()
        }
        else
        {
            throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED)
        }
    }
    else
    {
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED)
    }
}