import express from "express";
import { authSchema } from "./types/auth";
import { UrlModel, UserModel } from "./models/model";
import jwt from 'jsonwebtoken';
import { authMiddleware } from "./authmiddleware";
import { dbConnect } from "./utils/dbConnect";
import nodemailer from "nodemailer";
import { config } from 'dotenv';
import shortid from "shortid"

config()

const app = express();
app.use(express.json());
const PORT = parseInt(process.env.PORT || "");


dbConnect()
    .then(()=>console.log("Database connected"));

app.post("/api/signup",async (req,res)=>{
    const body = req.body;
    const {success} = authSchema.safeParse(body);
    if(!success){
        res.status(411).json({
            status: false,
            message: "Invalid Inputs"
        })
        return ;
    }
    try{
        const newUser = new UserModel({
            ...body
        })
        await newUser.save()

        const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET || '');

        res.status(200).json({
            status: true,
            data: {
                token
            }
        })
        return;

    }catch(e){
        res.status(500).json({
            status: false,
            message: "Internal server error occured"
        })
        return;
    }
    
})

app.post("/api/signin",async(req,res)=>{
    const body = req.body;
    const {success} = authSchema.safeParse(body);

    if(!success){
        res.status(411).json({
            status: false,
            message: "Invalid Inputs"
        })
        return ;
    }
    try{
        const user = await UserModel.findOne({
            ...body
        })
        if(!user){
            res.status(403).json({
                status: false,
                message: "User does not exist"
            })
            return ;
        }
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET || '');
        res.status(200).json({
            status: true,
            data: {
                token
            }
        })
        return;

    }catch(e){
        res.status(500).json({
            status: false,
            message: "Internal server error occured"
        })
        return;
    }

})

app.post("/api/forgetPassword",async (req,res)=>{
    const {email} = req.body;

    try{
        const user = await UserModel.findOne({
            email
        })
        if(!user){
            res.status(404).json({
                status: false,
                message: "User with given email not found"
            })
            return;
        }
        const OTP = Math.floor(100000 + Math.random()*900000);
        user.resetCode = OTP;
        user.resetCodeExpiry = Date.now() + 600000; // 10 mins
        await user.save();

        //refactor mailing in utils
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user:process.env.HANDLER_MAIL, pass: process.env.HANDLER_PASS
            }
        })
        const mailOptions = {
            to: email,
            from: process.env.HANDLER_MAIL,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://localhost:3000/api/reset-password/${OTP}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: true,
            message: "Password reset link sent to email"
        })

    }catch(e){
        res.status(500).json({
            status: false,
            message: "Internal server error occured"
        })
        return;
    }

})

app.post("/api/resetPassword/:OTP",async (req,res)=>{
   const OTP = parseInt(req.params.OTP)
   const {password} = req.body

   try {
        const user = await UserModel.findOne({
            resetCode: OTP,
            resetCodeExpiry:{
                $gt: Date.now()
            }
        })

        if(!user){
            res.status(404).json({
                status: false,
                message: "Invalid OTP"
            })
            return;
        }

        user.password = password;
        user.resetCode = -1;
        user.resetCodeExpiry = -1;

        await user.save();

        res.json({
            status: true,
            data:{

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

app.post("/url/shorten",authMiddleware,async (req,res)=>{
    const {longUrl} = req.body;
    try {
        
        const urlcode = shortid.generate();
    
        const newUrl = new UrlModel({
            urlcode,
            longUrl,
            shortUrl: `${process.env.SERVER_URI}/${urlcode}`,
        })
    
        await newUrl.save();

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

app.get("/:urlcode",async(req,res)=>{
    const {urlcode} = req.params;
    
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

    res.redirect(url.longUrl);
})

app.listen(PORT,()=>{
    console.log("Main Sever started, Ready to go...")
})

