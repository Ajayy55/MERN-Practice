import React from 'react'
import SideNav from '../widgets/layouts/SideNav'
import Navbar from '../components/Navbar/Navbar'
import Profile from '../pages/Profile/Profile'

function ProfileLayout({children}) {
  return (
    <>
    <main>
    <div
  className="position-absolute w-100 min-height-300 top-0"
  style={{
    backgroundImage:
      'url("https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/profile-layout-header.jpg")',
    backgroundPositionY: "50%"
  }}
>
    <span className="mask bg-primary opacity-6" />
    </div>

  <SideNav/>
  <div className="main-content position-relative max-height-vh-100 h-100">
  <Navbar/>
  <Profile/>
  </div>
  </main>
    </>
  )
}

export default ProfileLayout
