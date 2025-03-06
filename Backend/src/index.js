import express from 'express';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/database.js';
import dotenv from 'dotenv'

dotenv.config();
const app = express();

app.use(express.json()); // allow to distruct the request body
app.use("/api/auth",authRoutes);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`App is running at PORT : ${port}`);
    connectDB();
})