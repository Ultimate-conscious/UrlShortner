import mongoose from "mongoose";

export async function dbConnect(){
    const client = await mongoose.connect(process.env.MONGODB_URI ||'');
    
    return client;
}