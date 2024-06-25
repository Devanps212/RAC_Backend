import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/authServices";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";


export const UserAuthentication = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    
    if(!authHeader ||typeof authHeader !== 'string' || !authHeader.startsWith('Bearer '))
    {
        console.log("no header found")
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    
    if(!token)
    {
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    

    const verifyTokens = authService().verifyToken(token)
    
    
    if(!verifyTokens)
    {
        console.log("user not authorized")
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }
    console.log("token verified")

    
    const {role}:any = authService().decodeToken(token)
    console.log(role)
    if(role !=='user')
    {
        console.log("not user")
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    
    next()
       
}