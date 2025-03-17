import express from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/database.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server, socketio } from './lib/socketio.js';

dotenv.config();
app

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json()); // allow to distruct the request body
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/message",messageRoutes);
const port = process.env.PORT;
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