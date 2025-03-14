import {create} from 'zustand';
import axiosInstance from "./axios.js";
import {toast} from 'react-hot-toast';

const useChatstatus = create((set)=>({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers : async()=>{
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/message/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }finally{
            set({isUsersLoading : false});
        }
    },

    getMessages : async (userId)=>{
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages : res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        }finally{
            set({isMessagesLoading : false});
        }
    },
    // todo : update this one later
    setSelectedUser : (selectedUser)=>{
        set(state=>({selectedUser : selectedUser}));
    }

}));

export default useChatstatus;
