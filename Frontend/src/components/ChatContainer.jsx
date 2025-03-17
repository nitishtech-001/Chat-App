import React, { useEffect, useRef } from 'react'
import useChatStatus from "../lib/useChatStatus";
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import userAuthStatus from '../lib/userAuthStatus';
import ChatSelectedFirst from './ChatSelectedFirst';

export default function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessage } = useChatStatus();
  const { authUser } = userAuthStatus();
  const messagesEndRef = useRef(null);
  useEffect(()=>{
    if(messagesEndRef.current){
      setTimeout(()=>{
        messagesEndRef.current.scrollIntoView({behavior:"smooth"});
      },100);
    }
  },[messages]);

  useEffect(() => {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return ()=> unsubscribeToMessage();
  }, [selectedUser._id, getMessages,subscribeToMessages,unsubscribeToMessage]);

  if (isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <ChatInput />
    </div>
  )
  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const fileName = fileUrl.split("/").pop(); // Extract filename from URL
      const link = document.createElement("a");
  
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set filename for download
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Cleanup memory
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download the file.");
    }
  };
  return (
    <div className="flex flex-col w-full">
      <ChatHeader />
      {!messages || messages.length<1?(
        <ChatSelectedFirst />
      ):("")}
      <div className="felx-1 grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} `}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={message.senderId === authUser._id ? authUser.avatar : selectedUser.avatar}
                  alt={`${message.senderId === authUser._id ? authUser.username : selectedUser.username}+" profile picture`} />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time dateTime="text-xs opacity-50 ml-1">
                {message.createdAt.split("T").join("  ").split(".")[0]}
              </time>
            </div>
            <div className="chat-bubble flex flex-col gap-3">
              <div className="flex min-w-3/4 gap-3 items-center flex-wrap">
                {message.file.map((url, index) => (
                  <div className="flex flex-col items-center" key={index}>
                    {["jpg", "png", "jpeg", "gif", "tif", "tiff", "svg", "bmp", "webp", "heic", "avif", ".eps"].includes(url.split(".")[3]) ? (
                      <img
                        src={url}
                        alt="Images"
                        className="size-32 object-cover rounded-lg border border-zinc-700"
                      />

                    ) : url.split(".")[3] === "pdf" ? (
                      <iframe src={url} className="size-32"></iframe>
                    ) : (
                      <div className="p-2 border rounded">{url.split("/")[8] + "." + url.split(".")[3]}</div>
                    )
                    }
                    <a 
                    href={url} 
                    download={url.split("/")[7]} 
                    className="text-md border-2 w-full text-center rounded-sm hover:bg-blue-500" 
                    onClick={(e)=>{
                      e.preventDefault();
                      handleDownload(url);
                    }}
                    >
                      Download
                      </a>
                  </div>
                ))}
              </div>
              {message.text && (
                <div className="text-md">
                  <p>{message.text}</p>
                </div>
              )}
            </div>

          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <ChatInput />
    </div>
  )
}
