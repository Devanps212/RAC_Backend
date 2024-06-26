import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/authServices";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";

export const PartnerUserAuthentication = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    
    if (!token) {
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    
    const verifyTokens = authService().verifyToken(token);

    
    if (!verifyTokens) {
        console.log("User not authorized");
        throw new AppError('User is not authorized', HttpStatus.UNAUTHORIZED);
    }

    
    const { role, payload }: any = authService().decodeToken(token);

    
    if (role !== 'partner' && role !== 'user') {
        console.log("Role is not partner or user");
        throw new AppError('Partner is not authorized', HttpStatus.UNAUTHORIZED);
    }

    req.body.recieverId = payload;

    console.log("Authentication successful. Proceeding to next middleware...");
    next();
};
