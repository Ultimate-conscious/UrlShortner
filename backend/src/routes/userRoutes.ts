import { Router } from "express";
import { authSchema } from "../types/auth";
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/model";
import { resetPasswordMail } from "../utils/mailHandler";

export const userRouter = Router();


userRouter.post("/signup",async (req,res)=>{
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

userRouter.post("/signin",async(req,res)=>{
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

userRouter.post("/forgetPassword",async (req,res)=>{
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
        
        await resetPasswordMail(OTP,email);

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

userRouter.post("/resetPassword",async (req,res)=>{
   const {password,OTP} = req.body

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
