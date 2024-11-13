import React, { Children } from 'react'
import SideNav from '../components/sideNav/SideNav'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'

function Layout({children}) {
  return (
   <>
   <div className="container-scroller">
   <SideNav/>
   <div className="main-panel">
    <Navbar/>
    
    {children}
    </div>
   </div>
   <Footer/>
   
   </>
  )
}

export default Layout
