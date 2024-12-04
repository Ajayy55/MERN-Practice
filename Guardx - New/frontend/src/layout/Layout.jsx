// import React, { Children, useEffect, useState } from 'react'
// import SideNav from '../components/sideNav/SideNav'
// import Navbar from '../components/navbar/Navbar'
// import Footer from '../components/footer/Footer'
// import { Outlet } from 'react-router-dom';

// function Layout({children}) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 992) {
//         setIsSidebarOpen(true); // Always show sidebar on larger screens
//       } else {
//         setIsSidebarOpen(true); // Reset to closed for small screens
//       }
//     };

//     // Attach resize event listener
//     window.addEventListener("resize", handleResize);

//     // Set initial state based on screen size
//     handleResize();

//     return () => {
//       window.removeEventListener("resize", handleResize); // Cleanup listener
//     };
//   }, []);




//   return (
//    <>
   
//    <div className="container-scroller">
//    <SideNav isOpen={isSidebarOpen} />
//    <div className="main-panel">
//     <Navbar toggleSidenav={toggleSidebar}/>
    
//     {children}
//     {/* <Outlet /> */}
//     </div>
//    </div>
//    <Footer/>
   
//    </>
//   )
// }

// export default Layout

import React, { useEffect, useState } from "react";
import SideNav from "../components/sideNav/SideNav";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NormalizeUrl from "../pages/utils/NormalizeUrl";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

 
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsSidebarOpen(false); // Collapse sidebar on smaller screens
      } else {
        setIsSidebarOpen(true); // Expand sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("Current path:", location.pathname); // Should log the current path

  return (
    <>

    <div style={{background:"black"}}>
    <div className="container-scroller">
      <SideNav isOpen={isSidebarOpen} />
      <div className="main-panel">
        <Navbar toggleSidenav={toggleSidebar} />
        {/* Nested routes will be rendered here */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
    <Footer />
    </div>
    </>
  );
}

export default Layout;
