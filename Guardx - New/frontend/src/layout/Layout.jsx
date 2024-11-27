import React, { Children, useEffect, useState } from 'react'
import SideNav from '../components/sideNav/SideNav'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'

function Layout({children}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsSidebarOpen(true); // Always show sidebar on larger screens
      } else {
        setIsSidebarOpen(true); // Reset to closed for small screens
      }
    };

    // Attach resize event listener
    window.addEventListener("resize", handleResize);

    // Set initial state based on screen size
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener
    };
  }, []);




  return (
   <>
   
   <div className="container-scroller">
   <SideNav isOpen={isSidebarOpen} />
   <div className="main-panel">
    <Navbar toggleSidenav={toggleSidebar}/>
    
    {children}
    {/* <Outlet /> */}
    </div>
   </div>
   <Footer/>
   
   </>
  )
}

export default Layout
