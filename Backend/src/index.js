import express from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import { connectDB } from './lib/database.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();

app.use(express.json()); // allow to distruct the request body
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
const port = process.env.PORT;
app.listen(port,()=>{
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