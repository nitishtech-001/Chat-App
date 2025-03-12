import {create} from 'zustand';
import axiosInstance from './axios.js';

const userAuthStatus = create((set) =>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdateingProfile : false,

    isCheckingAuth : true,

    checkAuth : async ()=>{
        try {
            const res = await axiosInstance.get("/user/check");
            console.log(res.data);
            set({authUser : res.data});
        } catch (error) {
            console.log(error);
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false});
        }
    }
}));

export default userAuthStatus;