import { NextFunction, Request, Response } from "express"


const protectRoute = (req:Request, res: Response, next:NextFunction)=>{
    const token = req.cookies.j
}