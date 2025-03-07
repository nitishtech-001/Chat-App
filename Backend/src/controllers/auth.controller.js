import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import error from "../middleware/errorHandler.js";


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if(!username || !email || !password){
        return next(error(400,"All fields are required"));
    }
    const user = await User.findOne({$or: [{ email}, {username}]});
    if(user){
      return next(error(400,"User with the same Email or Username exist!"));
    }
    if (password.length < 6) {
      return next(error(400,"Password must be at least 6 Character!"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newuser = new User({ username, email, password: hashPass });

    if (newuser) {
      generateToken(newuser._id, res);
      await newuser.save();
      const {password,createdAt,updatedAt,__v,...rest} = newuser._doc;
      return res.status(201).json(rest);
    } else {
      return next(error(404,"User not Created!"));
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const {username,email,password} = req.body;
  try{
    if(!username && !email){
      return next(error(401,"Username or Email is required!"));
    }else if(!password){
      return next(error(401,"Password is required!"));
    }
    const user = await User.findOne({$or:[{email:email},{username:username}]});
    if(!user){
      return next(error(401,"Invalid Credential!"));
    }
    const validPass = await bcrypt.compare(password,user.password);

    if(!validPass){
      return next(error(401,"Invalid Credential!"));
    }
    generateToken(user._id,res);

    res.status(200).json({
      _id : user._id,
      username : user.username,
      email : user.email,
      avatar : user.avatar,
    })
  }catch(error){
    console.log("Error : "+error.message);
    next(error);
  }



};


