import {create} from 'zustand';
import axiosInstance from './axios.js';
import toast from 'react-hot-toast';

const userAuthStatus = create((set) =>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isLoggingOut : false,
    isCheckingAuth : true,

    checkAuth : async ()=>{
        try {
            const res = await axiosInstance.get("/user/check");
            set((state)=>({authUser : res.data}));
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
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
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
            return toast.success("Logged In Successfully");
        }catch(error){
            toast.error(error.response.data.message);
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
            toast.error(error.response.data.message);
            console.log(error);
        }finally{
            set(state=>({isUpdatingProfile : false}));
        }
    }
}));

export default userAuthStatus;