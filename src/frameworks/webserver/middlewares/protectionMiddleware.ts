import { NextFunction, Request, Response } from "express";
import { interfaceAuthService } from '../../../app/services/authServiceInterface';
import { authService } from "../../services/authServices";
import AppError from "../../../utils/appErrors";
import { HttpStatus } from "../../../types/httpTypes";

const authServices = interfaceAuthService(authService());

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("reached protect route");
        let token = req.body.userId;
        console.log("token found on body : ", token)
        let attachedBody = true;

        

        if (!token) {
            token = req.params.senderId;
            console.log("token found on params : ", token)
            attachedBody = false;
        }

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
                console.log("token found on header : ", token);
                attachedBody = true;
            }
        }

        

        if (!token) {
            throw new AppError("No token found", HttpStatus.UNAUTHORIZED);
        }

        const verifyToken = await authServices.tokenVerification(token);

        if (!verifyToken) {
            throw new AppError("Invalid token", HttpStatus.UNAUTHORIZED);
        }

        if (typeof verifyToken === 'object' && 'payload' in verifyToken) {
            if (attachedBody) {
                console.log("id attached to Body")
                req.body.userId = verifyToken.payload;
            } else {
                console.log("id attached to params")
                req.params.senderId = verifyToken.payload;
            }   
        } else {
            throw new AppError('Invalid Token', HttpStatus.UNAUTHORIZED);
        }
        console.log("payload found: ", verifyToken.payload);

        next();
    } catch (error: any) {
        next(new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
};
