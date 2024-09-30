import express from "express";
import { UrlModel} from "./models/model";
import { dbConnect } from "./utils/dbConnect";
import { config } from 'dotenv';
import { getFromCache, putUrlInCache } from "./utils/cacheHandler";
import { userRouter } from "./routes/userRoutes";
import { urlRouter } from "./routes/urlRoutes";

config()

const app = express();
const PORT = parseInt(process.env.PORT || "") || 3000;

dbConnect().then(()=>console.log("Database connected"));

app.use(express.json());
//seperate routing
app.use("/api",userRouter);
app.use("/url",urlRouter)



app.get("/:urlcode",async(req,res)=>{
    const {urlcode} = req.params;

    const {success,longUrl} = await getFromCache(urlcode);

    if(success){
        res.redirect(longUrl);
        return;
    }
    
    const url = await UrlModel.findOne({
        urlcode
    })
    if(!url){
        res.status(404).json({
            status: false,
            message: "No such url exists"
        })
        return;
    }

    await putUrlInCache(urlcode,url.longUrl);

    res.redirect(url.longUrl);
})

app.listen(PORT,()=>{
    console.log("Main Sever started, Ready to go...")
})

