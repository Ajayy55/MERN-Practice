// src/App.js
import React, { useEffect } from 'react';
import { messaging } from './firebase-config'
import { onMessage } from "firebase/messaging";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import Home from './pages/Home/Home';
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes';
import './App.css'
import LoginRoutes from './ProtectedRoutes/LoginRoutes';
import ResetPassword from './pages/ResetPassword/ResetPassword';

const App = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };

      new Notification(notificationTitle, notificationOptions);
    });
  }, []);

//   const timestamp = 1730273885735;
// const date = new Date(timestamp);
// console.log(date.toString());

  return (
    <BrowserRouter>
      <Routes>

      <Route element={<LoginRoutes/>}>
        <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>} />
        </Route>

          <Route element={<ProtectedRoutes/>}>
          <Route path="/home" element={<Home/>} />
          <Route path="/resetPassword" element={<ResetPassword/>} />
          
          </Route>

          <Route path="*" element={<div>No Page found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
