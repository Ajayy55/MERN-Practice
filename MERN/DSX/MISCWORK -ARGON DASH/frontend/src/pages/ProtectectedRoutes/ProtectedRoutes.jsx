import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
    const Token=localStorage.getItem('Token') || sessionStorage.getItem('Token')
  return Token ?  <Outlet/> : <Navigate to='/login'/>
}

export default ProtectedRoutes
