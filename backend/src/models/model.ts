import mongoose,{ Schema, Document} from "mongoose";
import { date } from "zod";

export interface User extends Document{
    email: string;
    password: string;
    resetCode: number;
    resetCodeExpiry: Number;
}

const UserSchema: Schema<User> = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        match: /^[A-Za-z\d@$!%*?&]{6}$/,
        lowercase: true,
        trim: true
    },
    resetCode:{
        type: Number,
        default: -1,
    },
    resetCodeExpiry:{
        type: Number,
        default: -1
    }
})

export const UserModel = mongoose.model('User',UserSchema);

export interface Url extends Document{
    urlcode: string;
    longUrl: string;
    shortUrl: string;
}

const UrlSchema: Schema<Url> = new Schema({
    urlcode: {
        type: String,
        required: true,
        unique: true,
        //lowercase: true,
        trim: true
    },
    longUrl:{
        type: String,
        required: true,
        match: /^(https?:\/\/)?([a-zA-Z\d-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/
    },
    shortUrl:{
        type: String,
        required: true,
        unique: true
    }
})

export const UrlModel = mongoose.model('Url',UrlSchema);

// export interface resetOtp extends Document{
//     email: string;
//     Otp: number;
// }

// const resetOtpSchema: Schema<resetOtp>  = new Schema({
//     email:{
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     Otp:{
//         type: Number,
//         required: true,
//     }
// })

// export const resetOtpModel = mongoose.model('resetOtpModel',resetOtpSchema);