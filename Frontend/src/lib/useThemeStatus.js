import { create } from "zustand";


const useThemeStatus = create((set)=>({
    theme : localStorage.getItem("chat-theme") || "dark",
    setTheme : (theme)=>{
        localStorage.setItem("chat-theme",theme);
        set(state=>({theme : theme}));
    },
}));

export default useThemeStatus;