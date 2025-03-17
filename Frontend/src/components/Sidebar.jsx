import React, { useEffect, useState } from 'react';
import useChatstatus from '../lib/useChatStatus';
import userAuthStatus from '../lib/userAuthStatus';
import SidebarSkeleton from './skeleton/SidebarSkeleton';
import { Search, Users } from 'lucide-react';

export default function Sidebar() {
  const {users,isUsersLoading,getUsers,setSelectedUser,selectedUser} = useChatstatus();
  const {onlineUsers} = userAuthStatus();
  const [filterUsers,setFilterUsers] = useState([]);
  const [toggle,setToggle] = useState(false);
  const [filterText,setFilterText] = useState("");
  useEffect(()=>{
    getUsers();
  },[getUsers]);

  useEffect(()=>{
    let sortUsers = toggle?users.filter(user=> onlineUsers.includes(user._id)):users;
    if(filterText){
      sortUsers = sortUsers.filter(user => user.username.toLowerCase().includes(filterText.toLowerCase()));
    }
    
    setFilterUsers(sortUsers);
  },[toggle,filterText]);

  if(isUsersLoading) return <SidebarSkeleton  />
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="flex items-center gap-1 justify-center lg:justify-end">
            <input 
              type="checkbox"
              onClick={()=>setToggle(!toggle)}
              className="size-5 rounded-full cursor-pointer"
              />
              <span >Online</span>
              <span className="hidden lg:inline">Friends</span>
        </div>

        <div className="relative hidden gap-2 lg:flex mt-3 items-center px-3 py-1 border border-base-400 rounded-sm">
          <Search className="size-4" />
          <input type="text" className="outline-none" value={filterText} onChange={(e)=>setFilterText(e.target.value)} />
          {filterText && <button className="btn size-5 font-semibold hover:bg-red-500" onClick={()=>setFilterText("")}>X</button>}
        </div>

      </div>

        <div className="overflow-y-auto w-full py-3">
          {filterUsers.map((user)=>(
            <button 
            key={user._id}
            onClick={()=>setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id?"bg-base-300 ring-1 ring-base-300":""}`}>
              <div className="relative flex flex-col items-center justify-center mx-auto lg:mx-0 max-w-full">
                <img 
                src={user.avatar} 
                alt={`profile pic of ${user.username}`} 
                className="size-8 object-cover rounded-full lg:size-12 lg:min-w-12"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="size-3 absolute bottom-0 right-0 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
                <span className="text-sm lg:hidden truncate max-w-full">{user.username}</span>
              </div>

                {/* User info - only visible on large screens */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.username}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id)?"Online":"Offline"}
                  </div>
                </div>
            </button>
          ))}
        </div>

    </aside>
  )
}
