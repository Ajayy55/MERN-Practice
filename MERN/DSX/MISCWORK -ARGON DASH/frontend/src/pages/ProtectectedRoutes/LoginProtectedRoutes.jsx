import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function LoginProtectedRoutes() {
    const Token=localStorage.getItem('Token') || sessionStorage.getItem('Token')
  return Token ?   <Navigate to='/dashboard'/>: <Outlet/>
} 

export default LoginProtectedRoutes