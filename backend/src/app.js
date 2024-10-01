import cookieParser from "cookie-parser";
import cors from "cors";
import {errorMiddleware} from "./middlewares/error.js"
import dotenv from "dotenv";
import userRouter from "../src/routes/userRouter.js";  // Import userRouter from userRouter.js
import taskRouter from "../src/routes/taskRouter.js";  // Import taskRouter from taskRouter.js
import connectDB from "../src/db/index.js"
dotenv.config({
    path:'./env'
})



import express from "express";
const app=express();

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","PUT","DELETE","POST"],
    credentials:true
}))
app.use(cookieParser());  
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/v1/user",userRouter);
app.use("/api/v1/task",taskRouter);

/* 


*/
//connectDB();
app.use(errorMiddleware);

export default app;
