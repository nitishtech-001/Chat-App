import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import userAuthStatus from './lib/userAuthStatus.js';
import { useEffect } from 'react';
import {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';

function App() {
  const {authUser,checkAuth, isCheckingAuth} = userAuthStatus();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  // console.log(authUser);
  if(isCheckingAuth && !authUser){
   return <div className="flex items-center justify-center h-screen">
      <Loader className="size-20 animate-spin" />
    </div>
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser?<Home />:<Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser?<Signup />:<Navigate to="/" />} />
        <Route path="/login" element={!authUser?<Login />:<Navigate to="/" />} />
        <Route path="/setting" element=<Setting /> />
        <Route path="/profile" element={authUser?<Profile />:<Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App
