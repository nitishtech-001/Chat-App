import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const socketio = new Server(server,{
    cors: {
        origin : ["http://localhost:5173"]
    }
});

// used to store online users
const userSocketMap = {}; // {userId : socketId}

export const getReceiverSocketId = (receiverId)=>{
    return userSocketMap[receiverId];
}

socketio.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    // io.emit() is used to handle send event to all the connected clients
    socketio.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        delete userSocketMap[userId]
        // after deleting the disconnected user 
        socketio.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export {socketio,app,server};