import React, { useState, useEffect } from 'react'
import userAuthStatus from '../lib/userAuthStatus';
import useChatstatus from '../lib/useChatStatus';
import { Image, Paperclip, Send } from "lucide-react";
import toast from 'react-hot-toast';

export default function ChatInput() {
  const { uploadFiles, sendMessages } = useChatstatus();
  const { authUser } = userAuthStatus();
  const { selectedUser } = useChatstatus();
  const [filePreview, setFilePreview] = useState([]);
  const [file, setFile] = useState([]);
  const [sending,setSending] = useState(false);
  const [formData, setFormData] = useState({
    senderId: authUser._id,
    receiverId: selectedUser._id,
    text: "",
    file: [],
  });

  const handleChange = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.target.files);
    setFile((prevFile) => [...prevFile, ...selectedFiles]);

    const previewPromises = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => resolve({ type: "image", url: event.target.result });
          reader.readAsDataURL(file);
        } else if (file.type === "application/pdf") {
          resolve({ type: "pdf", url: URL.createObjectURL(file) });
        } else {
          resolve({ type: "file", name: file.name });
        }
      });
    });

    Promise.all(previewPromises).then((previews) => {
      setFilePreview((prevPreviews) => [...prevPreviews, ...previews]);
    });
  };

  const removeImage = (index) => {
    setFilePreview((prev) => prev.filter((_, i) => i !== index));
    setFile((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll =  ()=>{
    setFormData({...formData,text:"",file:[]});
    setFile([]);
    setFilePreview([]);
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    if(!file && !formData.text){
      return toast.error("Select file or type something!");
    }
    let updatedFormData = {...formData};
    if(file.length >0){
      try{
        const fileUrls =await uploadFiles(authUser.username,...file);
        if(!fileUrls){
          setSending(false);
          return toast.error("File size too large");
        }
        updatedFormData = {...updatedFormData,file:fileUrls};
      }catch(error){
        toast.error("File are not uploaded!");
        console.log(error);
      }
      setFormData({...updatedFormData});
    }
    await sendMessages(selectedUser._id,updatedFormData);
    clearAll();
    toast.success("Message send succesfully!");
    setSending(false);
  };
 
  return (
    <div className="p-4 w-full bg-primary">
      {filePreview.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          {filePreview.map((file, index) => (
            <div className="relative" key={index}>
              {file.type === "image" ? (
                <img
                  src={file.url}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
              ) : file.type === "pdf" ? (
                <iframe src={file.url} className="w-20 h-20"></iframe>
              ) : (
                <div className="p-2 border rounded">{file.name}</div>
              )}

              <button
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 right-0 size-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-red-700 hover:cursor-pointer"
                type="button"
              >
                <span className="text-lg font-semibold">X</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input section */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={formData.text}
            id="textInput"
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
          <label htmlFor="image-upload" className="hover:cursor-pointer">
            <Image className="size-7" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              multiple
              onChange={handleChange}
            />
          </label>

          <label htmlFor="file-upload" className="hover:cursor-pointer">
            <Paperclip className="size-7" />
            <input
              type="file"
              accept=".pdf, .zip, .txt, .doc, .docx, .xls, .xlsx, .mp4, .mp3"
              className="hidden"
              id="file-upload"
              onChange={handleChange}
              multiple
            />
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle p-[5px] hover:cursor-pointer disabled:cursor-none"
          disabled={!formData.text.trim() && filePreview.length === 0 || sending}
        >
          <Send className="size-6" />
        </button>
      </form>
    </div>
  );
}
