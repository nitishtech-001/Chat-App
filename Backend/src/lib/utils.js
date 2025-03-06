import jwt from 'jsonwebtoken';

export const generateToken = (userId,res)=> {

    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn : "7d"});

    res.cookie("access_token",token,{
        maxAge : 7*24*60*60*1000,
        httpOnly : true, // revent XSS attacks cross-site scripting sttacks
        sameSite : "strict", // CSRF attacks cross-site request forgery attacks
        secure : process.env.NODE_ENV !== "development"
    });

    return token;
}