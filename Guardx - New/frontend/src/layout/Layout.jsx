import React, { Children } from 'react'
import SideNav from '../components/sideNav/SideNav'
import Navbar from '../components/navbar/Navbar'

function Layout({children}) {
  return (
   <>
   <div className="container-scroller">
   <SideNav/>
   <div class="main-panel">
    <Navbar/>
    
    {children}
    </div>
   </div>
   
   
   </>
  )
}

export default Layout
