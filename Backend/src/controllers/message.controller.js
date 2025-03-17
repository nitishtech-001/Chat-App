import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import error from "../middleware/errorHandler.js";
import { getReceiverSocketId, socketio } from "../lib/socketio.js";

export const getUserForSideBar = async (req,res,next)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return next(error(402, "User id is not Valid"));
        }
        const user = await User.findById(req.user.userId);
        if(!user){
            return next(error(401,"Session expire try again login!"));
        }
        const loggedUserId = user._id;
        const filteredUsers = await User.find(
            {
                _id : {$ne:loggedUserId}
            }
        ).select("-password");
        if(!filteredUsers){
            return next(error(401,"Other users not found"));
        }
        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("Error message : ",err.message);
        next(err);
    }
}
export const getMessages = async (req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.user.userId)){
            return next(error(401,"User id not valid"));
        }
        const userToChatId = req.params.id;
        const myId = req.user.userId;
        const messages = await Message.find(
            {$or:[
                {
                    senderId : myId,
                    receiverId : userToChatId
                },
                {
                    senderId : userToChatId,
                    receiverId : myId
                }
            ]}
        );
        res.status(200).json(messages);
    }catch(err){
        console.log("Error message : ",err.message);
        next(err);
    }
}

export const sendMessage = async (req,res,next)=>{
    const {senderId : myId,receiverId : userToChatId,text,file} = req.body;
    if(!mongoose.Types.ObjectId.isValid(userToChatId) || userToChatId !== req.params.id){
        return next(error(402,"Receiver does not exist!"));
    }
    if(!mongoose.Types.ObjectId.isValid(myId) || req.user.userId !== myId){
        return next(error(402,"You are not Authenticated"));
    }
    try{
        const users = await User.find(
            {
                _id : {
                    $in: [myId,userToChatId]
                }
            }
        ).select("-password");
        if(!users){
            return next(error(404,"Sender and Receiver not found"));
        }else if(users.length === 1){
            if(users[0]._id == myId){
                return next(error(401,"Receiver does not exist"));
            }else{
                return next(error(401,"Your session is expired"));
            }
        }
        const message = new Message({
            senderId : myId,
            receiverId : userToChatId,
            text : text || "",
            file : file || []
        });
        await message.save();
        // TODO : realtime functionality goes here => socket.io
        const receiverSocketId = getReceiverSocketId(userToChatId);
        if(receiverSocketId){
            socketio.to(receiverSocketId).emit("newMessage",message);
        }
        res.json(message);
    }catch(err){
        console.log("Error message : ",err.message);
        next(err);
    }
}