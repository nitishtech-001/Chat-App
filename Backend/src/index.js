import express from 'express';
import authRoutes from './routes/auth.route.js';
const app = express();

app.use("/api/auth",authRoutes);


const port = 5000;
app.listen(port,()=>{
    console.log(`App is running at PORT : ${port}`)
})