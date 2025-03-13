import error from "./errorHandler.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
const verifyToken = (req,res,next)=>{
    try{
        const token = req.cookies.access_token;
        if(!token){
            return next(error(401,"Your session is expire."))
        }
        jwt.verify(token,process.env.JWT_SECRET,(error,user)=>{
            if(error){
                return res.status(402).json(error.message);
            }
            req.user = user;
        });
        next();
    }catch(error){
        console.log(error);
    }
}


export default verifyToken;