import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function LoginRoutes() {

        const user=localStorage.getItem("Token") || localStorage.getItem("FireToken") 
         return  !user ? <Outlet/> : <Navigate to='/home'/>

}

export default LoginRoutes

