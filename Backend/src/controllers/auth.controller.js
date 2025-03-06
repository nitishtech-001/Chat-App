import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if(!username || !email || !password){
        return res.status(400).json({message : "All fields are required!"});
    }
    const user = await User.findOne({$or: [{ email}, {username}]});
    if(user){
        return res.status(400).json({meaasge : "User with the same Email or Username exist!"});
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 Character!" });
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
      res.status(400).json({ messge: "User not Created!" });
    }
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res.status(500).json({ message: "Internal server Eror" });
  }
};

export const login = (req, res, next) => {
  console.log("Listening the login getRequest....");
  res.status(200).json({
    message: "you get the login credential",
  });
};
export const logout = (req, res, next) => {
  console.log("Listening the logout getRequest....");
  res.status(200).json({
    message: "you get the logout credential",
  });
};
