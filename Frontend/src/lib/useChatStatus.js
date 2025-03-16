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
