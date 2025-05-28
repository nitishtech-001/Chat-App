import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import error from "../middleware/errorHandler.js";
import cloudinary from "../lib/cloudinary.js";


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
      const {password,__v,...rest} = newuser._doc;
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
      createdAt : user.createdAt,
      updatedAt : user.updatedAt
    })
  }catch(error){
    console.log("Error : "+error.message);
    next(error);
  }



};

export const uploadFiles = async (req,res,next)=>{
  try{
    if(!req.files || req.files.length === 0){
      return next(error(401,"Plese provide the Image!"));
    }
    else if(req.files.length >10){
      return next(error(401,"Max 10 file can be uploaded!"));
    }
    const folderName = "Chat_App/"+req.body.folderName || "upload";

    const uploadPromises = req.files.map((file)=>{
      const fileSizeLimit = 10 * 1024 * 1024; // 10 MB
      if (file.size > fileSizeLimit) {
        return Promise.reject(error(401, "File size exceeds the limit!"));
      }
      const resourceType = getFileResourceType(file.mimetype);
      const extension = file.originalname.split('.').pop() || "image";
      return new Promise((resolve,reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder : folderName, 
            resource_type : resourceType,
            use_filename:true,   
            format : extension
          },    
          (err,result)=>{
            if(err){
              reject(err);
            }else{
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });
    
    // wait for all images to upload
    const fileUrls = await Promise.all(uploadPromises);

    res.status(200).json({folderName : folderName,fileUrls : fileUrls});
  }catch(err){
    console.log("Error uploading Image : ",err.message);
    next(err);
  }
}
const getFileResourceType = (mimetype) => {
  if (mimetype.startsWith("image/")) {
    return "image";
  } else if (mimetype.startsWith("video/")) {
    return "video";
  } else{
    return "raw";
  }
};

export const googleLogin = async (req,res,next)=>{
  const {email,username,avatar} = req.body;
  if(!email || !username){
    return next(error(401,"Provide email and username"));
  }
  try{
    let user = await User.findOne({$or: [{ email}, {username}]});
    if(!user){
      const password = email.split("@")[0];
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);
  
      const newuser = new User({ username, email, password: hashPass,avatar:avatar });
  
      if (newuser) {
        generateToken(newuser._id, res);
        await newuser.save();
        const {password,__v,...rest} = newuser._doc;
        return res.status(201).json(rest);
      }
    } else {
      generateToken(user._id,res);
      res.status(200).json({
        _id : user._id,
        username : user.username,
        email : user.email,
        avatar : user.avatar,
        createdAt : user.createdAt,
        updatedAt : user.updatedAt
      });
    }
  }catch(err){
    next(error(err.message));
    console.log(err.message);
  }
}

