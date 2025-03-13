import React, { useState } from 'react'
import userAuthStatus from '../lib/userAuthStatus'
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import {Camera, Eye, EyeClosed, Lock, Mail, User} from 'lucide-react';


export default function Profile() {
  const {authUser,isUpdatingProfile,updateProfile} = userAuthStatus();
  const [imageUpdate,setImageUpdate] = useState({loading:false,error:""});
  const [showPassword,setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    password : "",
    avatar : authUser.avatar
  });
  const handleImageUpload = async(e)=>{
    const file = e.target.files[0];
    if(!file){
      return toast.error("Select profile picture");
    }
    setImageUpdate({...imageUpdate,loading:true});
    try{
      const imageForm = new FormData();
      imageForm.append("folderName",authUser.username+"/avatar");
      imageForm.append("file",file);
      const res =await axiosInstance.post("/auth/upload-file",imageForm,{
        headers : {
          "Content-Type" : "multipart/form-data",
        }
      });
      setImageUpdate({...imageUpdate,loading:false});
      setFormData({...formData,avatar:res.data.fileUrls[0]});
      toast.success("Click to update profile actually update")
    }catch(err){
      toast.error(err.message);
      console.log(err);
      setImageUpdate({...imageUpdate,loading:false,error:err.message});
    }
  }
  const handleUpdate = async ()=>{
    if(!formData.password){
      const update = {avatar : formData.avatar};
      updateProfile(update,authUser._id);
    }
    else if(formData.password && formData.password.length >= 6){
      updateProfile(formData,authUser._id);
      setFormData({...formData,password:""});
    }
  }
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {/* Avatar upload functionality */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img 
              src={formData.avatar} 
              alt="Profile image of user" 
              className="size-32 rounded-full object-cover border-4"
              />
              <label htmlFor="avatar-profile" 
              className = {`absolute bottom-0 right-0 bg-base-content hover-scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${imageUpdate.loading?"animate-pulse pointer-events-none":""}`}
              >
                <Camera className="size-5 text-base-200"  />
                <input 
                type="file" 
                id="avatar-profile"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled = {imageUpdate.loading}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
                {imageUpdate.loading?"Updloading.....":"Click the cemera icon to update your avatar"}
              </p>
          </div>
          {/* User info section */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Username
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.username}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Lock className="size-4" />
                Password
              </div>
              <div className="relative">
              <input 
              type={showPassword?"text":"password"}
              className="px-4 py-2.5 bg-base-200 rounded-lg border w-full" 
              value={formData.password}
              onChange={(e)=>setFormData({...formData,password:e.target.value})}
              placeholder='Enter pass to change'
              />
              <span
              className="absolute right-3 top-2.5 hover:cursor-pointer"
              onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword?(<Eye className="size-6" />):(<EyeClosed className="size-6" />)}
              </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
              <button className="btn uppercase px-4 py-2.5 bg-base-200 rounded-lg border w-full hover:bg-green-500 font-semibold"
              onClick={handleUpdate}>
                {isUpdatingProfile?"Updating profile...":"Update profile"}
              </button>
          </div>

          <div className="mt-6 bg-base-200 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 ">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Last Updated</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
