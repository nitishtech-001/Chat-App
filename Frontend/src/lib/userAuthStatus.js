import {create} from 'zustand';
import axiosInstance from './axios.js';
import toast from 'react-hot-toast';
import {io as socketio} from "socket.io-client"

const BASE_URL = import.meta.env.VITE_MODE === "development"?"http://localhost:5000":"/";

const userAuthStatus = create((set,get) =>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isLoggingOut : false,
    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,

    checkAuth : async ()=>{
        try {
            const res = await axiosInstance.get("/user/check");
            set((state)=>({authUser : res.data}));
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set((state)=>({authUser : null}));
        }finally{
            set((state)=>({isCheckingAuth : false}));
        }
    },

    signup : async (data)=>{
        set((state)=>({isSigningUp : true}));
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfully!");
            set(state=>({authUser : res.data}));
            get().connectSocket();
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }finally{
            set(state=>({isSigningUp : false}));
        }
    },

    logout : async (userId)=>{
        set(state=>({isLoggingOut : true}))
        try{
            const res = await axiosInstance.post(`/user/logout/${userId}`);
            toast.success(res.data.message);
            set(state=>({authUser:null}));
            get().disconnectSocket();
            return ;
        }catch(error){
            toast.error("Somthing went wrong!"); 
            console.log(error);
        }finally{
            set(state=>({isLoggingOut : false}));
        }
    },

    login : async(data)=>{
        set(state=>({isLoggingIn : true}));
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set(state=>({authUser : res.data}));
            toast.success("Logged In Successfully");
            get().connectSocket()
        }catch(error){
            toast.error(error.message);
            console.log(error);
        }finally{
            set(state=>({isLoggingIn : false}));
        }
    },

    updateProfile : async (data,userId)=>{
        set(state=>({isUpdatingProfile : true}));
        try{
            const res = await axiosInstance.post(`/user/update-profile/${userId}`,data);
            set(state=>({authUser:res.data}));
            toast.success("Account Updated Successfully");
        }catch(error){
            toast.error(error.message);
            console.log(error);
        }finally{
            set(state=>({isUpdatingProfile : false}));
        }
    },

    connectSocket : ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = socketio(BASE_URL,{
            query : {
                userId : authUser._id
            }
        });
        socket.connect();
        set({socket:socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers : userIds});
        })
    },

    fireBaseAuth : async (data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post("/auth/googleLogin",data);
            set({authUser:res.data});
            toast.success("Logged in succesfully!");
            get().connectSocket()
        }catch(error){
            toast.error(error.response.data.message);
            console.log(error);
        }finally{
            set({isLoggingIn:false});
        }
    },

    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));

export default userAuthStatus;