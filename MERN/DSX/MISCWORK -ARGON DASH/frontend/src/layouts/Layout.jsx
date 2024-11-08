import React from 'react'
import SideNav from '../widgets/layouts/SideNav'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

function Layout({children}) {
  return (
   <>
    <div className='class="g-sidenav-show bg-gray-100 g-sidenav-pinned"'>
    <div className="min-height-300 bg-primary position-absolute w-100"></div>
    <SideNav/>
    <main className="main-content position-relative border-radius-lg ">
    <Navbar/>
    {children}
    <Footer/>
    </main>
    
    </div>
    
   </>
  )
}
Layout
export default Layout
