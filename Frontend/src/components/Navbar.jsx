import React from 'react'
import userAuthStatus from '../lib/userAuthStatus.js'
import { Link } from 'react-router-dom';
import { AtSignIcon, LogOut, MessageSquare, Settings, User } from 'lucide-react';

export default function Navbar() {
  const {isLoggingOut,logout, authUser} = userAuthStatus();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg ">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center justify-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="size-5 text-primary"  />
                </div>
                <h1 className="text-sm font-bold sm:text-lg">Chatty App</h1>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/setting" className="btn btn-sm gap-2 transition-colors">
                <Settings className="size-4"  />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              {authUser? (
                <>
                  <Link to="/profile" className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button className="btn btn-sm flex gap-2 items-center" onClick={()=>logout(authUser._id)}>
                    <LogOut className="size-5"  />
                    <span className="hidden sm:inline">{isLoggingOut?"Logging Out...":"Logout"}</span>
                  </button>
                </>
              ):(<Link to="/login" className="btn btn-sm gap-2 transition-colors">
                <AtSignIcon className="size-4"  />
                <span className="hidden sm:inline">Sign in</span>
              </Link>)}
            </div>
          </div>
        </div>
    </header>
  )
}
