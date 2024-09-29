import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    //@ts-ignore
    const token = req.headers?.authorization || '';
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET || '');
        next();
    } catch (error) {
        res.status(403).json({
            status: false,
            message: "Wrong Token sent"
        })
        return
    }
}
    