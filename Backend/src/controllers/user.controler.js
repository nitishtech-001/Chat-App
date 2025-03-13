import error from "../middleware/errorHandler.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


export const logout = (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(error(402, "User id is not Valid"));
    }
    if (!req.user) {
      return next(error(401, "User does not exist"));
    }
    if (req.user.userId !== req.params.id) {
      return next(error(403, "You can only Logout your Own Account"));
    }
    res.cookie("access_token", "", { maxAge: 0 });
    res.status(200).json({
      message: "Log-out successfully!",
    });
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(error(402, "User id is not Valid"));
    }
    if (!req.user) {
      return next(error(403, "User not exist"));
    }
    if (req.user.userId !== req.params.id) {
      return next(error(403, "You can only Update your Own Profile"));
    }
    if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password,10);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id,
        {
            $set:{
                password : req.body.password,
                avatar : req.body.avatar
            }
        },{new:true}
    );
    const {password,__v,...rest} = updateUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
    console.log(error);
  }
};
export const deleteProfile = async (req,res,next)=>{
  try{
    if(!mongoose.Types.ObjectId.isValid(req.user.userId) && !mongoose.Types.ObjectId.isValid(req.params.id)){
      return next(error(402,"User id not valid!"));
    }
    if(req.user.userId !== req.params.id){
      return next(error(403,"You can only Delete your own Profile!"));
    }
    res.cookie("access_token", "", { maxAge: 0 });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message : "User deleted succesfully!"});
  }catch(error){
    console.log(error);
    next(error);
  }
}

export const userAuthCheck = async (req,res,next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.user.userId)){
    return next(error(401,"Your object Id is incorrect!"));
  }
  try{
    const user = await User.findById(req.user.userId);
    const {password,__v,...rest} = user._doc;
    res.status(200).json(rest);
  }catch(err){
    console.log(err);
    next(err);
  }
}