import {create} from 'zustand';
import axiosInstance from './axios.js';
import toast from 'react-hot-toast';

const userAuthStatus = create((set) =>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,

    isCheckingAuth : true,

    checkAuth : async ()=>{
        try {
            const res = await axiosInstance.get("/user/check");
            console.log(res.data);
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
    }
}));

export default userAuthStatus;