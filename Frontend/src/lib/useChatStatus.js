import {create} from 'zustand';
import axiosInstance from "./axios.js";
import {toast} from 'react-hot-toast';
import  userAuthStatus  from './userAuthStatus.js';

const useChatstatus = create((set,get)=>({
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
    // todo : optimize this one later
    subscribeToMessages : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return ;
        const socketio = userAuthStatus.getState().socket;
        socketio.on("newMessage",(newMessage)=>{
            set(state=>({messages : [...state.messages,newMessage]}))
        })
    },

    unsubscribeToMessage : ()=>{
        const socketio = userAuthStatus.getState().socket;
        socketio.off("newMessage");
    },

    setSelectedUser : (selectedUser)=>{
        set(state=>({selectedUser : selectedUser}));
    },

    sendMessages : async (receiverId,formData)=>{
        try{
            const res = await axiosInstance.post(`/message/send/${receiverId}`,formData);
            set(state=>({messages : [...state.messages,res.data]}));
        }catch(error){
            toast.error(error.response?.data?.message || "Message sending failed");
            console.log(error)
        }
    },

    uploadFiles : async (folderName,...files)=>{
        try{
            const formData = new FormData();
            formData.append("folderName", folderName);
            files.map((item)=>{
                formData.append("file",item);
            });
            
            const res = await axiosInstance.post("/auth/upload-file",formData);
            return res.data.fileUrls;
        }catch(error){
            toast.error(error.response?.data?.message || "Error file uploading");
            console.log(error);
        }

    }
}));

export default useChatstatus;
