//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from '../src/db/index.js'
import app from "../src/app.js";
dotenv.config({
    path:'./env'
})
connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port :${process.env.PORT}`);
    
})






/* 
import express from "express"
const app=express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("Error",error);
        throw error
    }
})()
 */