import express from 'express';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/database.js';

const app = express();
import dotenv from 'dotenv'

app.use("/api/auth",authRoutes);
dotenv.config();

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`App is running at PORT : ${port}`);
    connectDB();
})