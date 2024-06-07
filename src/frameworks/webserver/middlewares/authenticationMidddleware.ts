import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";
import { authService } from "../../services/authServices";
import { CustomRequest } from "../../../types/custom";


export const authentication = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    console.log("authHeader : ",authHeader)
    if(!authHeader ||typeof authHeader !== 'string' || !authHeader.startsWith('Bearer '))
    {
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
    const {role}:any = authService().decodeToken(token)
    console.log(role)
    if(role !=='partner' && role !=='admin' && role !== 'user')
    {
        console.log("not partner not admin nor user")
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    let customReq = req as CustomRequest
    customReq.role = role 
    next()
       
}

export const RoleAuthMiddleware = (roleOrRoles: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const customReq = req as CustomRequest;
      const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  
      if (!roles.includes(customReq.role)) {
        console.log('Not expected role');
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
      }
  
      next();
    };
  };
