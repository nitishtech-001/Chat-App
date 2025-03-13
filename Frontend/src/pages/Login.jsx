import React, { useState } from 'react'
import { Eye, EyeClosed, Loader2, Lock, Mail, MessageSquare, User as UserIcon} from 'lucide-react';
import userAuthStatus from '../lib/userAuthStatus';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
export default function Login() {
  const {isLoggingIn,login} = userAuthStatus();
  const [showPassword,setShowPassword] = useState(false);
  const [formData,setFormData] = useState(
    {
      username : "",
      email : "",
      password : "",
    }
  );
  const validateForm = ()=>{
    if(!formData.username.trim()) return toast.error("Username/Email is required");
    if(!formData.password) return toast.error("Password is required!")
    if(formData.password.length < 6) return toast.error("Password must contain alteast 6 charcaters")
    
      return true;
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    const success = validateForm();
    if(success===true){
      login(formData);
    }
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Get started your account</p>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Username/Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-1">
                <UserIcon className="size-5 text-base-content/40" />
              </div>
              <input 
              type="text"
              className={`input input-border w-full pl-10`} 
              placeholder="Nitish kumar"
              value={formData.username}
              onChange={(e)=>setFormData({...formData,username: e.target.value,email:e.target.value})}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-1">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input 
              type={showPassword?"text":"password"}
              className={`input input-border w-full pl-10`} 
              placeholder="strong@pass_word"
              value={formData.password}
              onChange={(e)=>setFormData({...formData,password: e.target.value})}
              
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-2 hover:cursor-pointer"
              onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword?(
                <Eye className="size-5 hover:cursor-pointer"/>):<EyeClosed className="size-5 hover:cursor-pointer"/>
                }
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full uppercase" disabled={isLoggingIn}>
            {isLoggingIn?(
              <>
                <Loader2 className="size-5 animate-spin" />
                Logging In...
              </>
            ):("Login to account")
            }
          </button>

        </form>
            // ADD FIREBASE EMAIL VERIFICATION DIRECTLY
        <div className="text-center">
          <p className="text-base-content/60">
          Don't have an account?{"  "}
          <Link to="/signup" className="link link-primary">
            Sign up
          </Link>
          </p>
        </div>
      </div>
    </div>
      {/* Right SIDE */}
      <AuthImagePattern 
      title = "Join our community"
      subtitle = "Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}
