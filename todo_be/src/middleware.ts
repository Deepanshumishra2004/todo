import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./config";

export const userMiddleWare=(req: Request,res:Response,next:NextFunction)=>{
    
    const header = req.headers["authorization"];

    console.log('token : ', header);

    if(!header) return res.json({message : "Token is missing"})
    
        try{
            const user = jwt.verify(header,JWT_SECRET);
            (req as any).user = user;
            next();
        }catch(e){
            res.status(403).json({message : "invalid or expired token"});
        }

}