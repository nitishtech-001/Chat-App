import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import userRoutes from './src/routes/user.route.js';
import messageRoutes from './src/routes/message.route.js';
import { connectDB } from './src/lib/database.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server} from './src/lib/socketio.js';
import path from 'path';

dotenv.config();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json()); // allow to distruct the request body
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../Frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"))
    })

}

server.listen(port,()=>{
    console.log(`App is running at PORT : ${port}`);
    connectDB();
});

//sending error  to the end user
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
});