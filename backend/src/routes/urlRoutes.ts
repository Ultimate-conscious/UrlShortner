import { Router } from "express";
import { authMiddleware } from "../authmiddleware";
import shortid from "shortid";
import { UrlModel } from "../models/model";
import { putUrlInCache } from "../utils/cacheHandler";


export const urlRouter = Router();

urlRouter.post("/shorten",authMiddleware,async (req,res)=>{
    const {longUrl} = req.body;
    try {
        
        const urlcode = shortid.generate();
    
        const newUrl = new UrlModel({
            urlcode,
            longUrl,
            shortUrl: `${process.env.SERVER_URI}/${urlcode}`,
        })
    
        await newUrl.save();

        await putUrlInCache(urlcode,longUrl);

        res.json({
            status: true,
            data:{
                urlcode,
                longUrl,
                shortUrl: `${process.env.SERVER_URI}/${urlcode}`
            }
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error occured"
        })
        return;
    }

})