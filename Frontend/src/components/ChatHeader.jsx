import React from 'react'
import useChatstatus from '../lib/useChatStatus';
import userAuthStatus from '../lib/userAuthStatus';
import { Phone, Video } from 'lucide-react';
import toast from 'react-hot-toast';


export default function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatstatus();
    const { onlineUsers } = userAuthStatus();
    return (
        <div className="p-[9.8px] border-b border-base-300 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img
                                src={selectedUser.avatar}
                                alt={`${selectedUser.username} Profile pic`} />
                        </div>
                    </div>
                    {/* selected user info */}
                    <div>
                        <h3 className="font-bold">{selectedUser.username}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id)?(<span className="text-green-500">Online</span>):(<span>Offline</span>)}
                        </p>
                    </div>
                </div>

            <div className="flex gap-6 items-center">
                <div className="hidden  sm:flex gap-2 items-center border border-base-300 p-2 rounded-sm" onClick={()=>toast.success("I will add it soon..")}>
                    <span className="border-r-2 pr-1 hover:cursor-pointer"><Video className="size-6"/></span>
                    <span className="hover:cursor-pointer"><Phone className="size-5" /></span>
                </div>
                {/* Close button */}
                <button 
                onClick={()=>setSelectedUser(null)}
                className="btn font-bold size-11 rounded-lg text-xl hover:bg-red-700"
                >
                    X
                </button>
            </div>
            </div>

        </div>
    )
}
