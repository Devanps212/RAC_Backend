import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/authServices";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";


export const UserAuthentication = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    console.log("authHeader : ",authHeader)
    if(!authHeader ||typeof authHeader !== 'string' || !authHeader.startsWith('Bearer '))
    {
        console.log("no header found")
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    console.log("token :", token)
    if(!token)
    {
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    console.log("token checking")

    const verifyTokens = authService().verifyToken(token)
    
    console.log(verifyTokens)
    if(!verifyTokens)
    {
        console.log("user not authorized")
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }
    console.log("token verified")

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