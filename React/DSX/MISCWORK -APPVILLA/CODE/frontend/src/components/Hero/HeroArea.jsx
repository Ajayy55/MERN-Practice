import React from 'react'
import './Hero.css'
import { AiOutlineApple } from "react-icons/ai";
import { IoLogoGooglePlaystore } from "react-icons/io5";

function HeroArea() {
  return (
    <>
<div className='Hero-area' id='hero'>
<div className="container">
  <div className="row align-items-center px-5 mx-5">
    <div className="col-lg-5 col-md-12 col-12">
         <h1 className=''>A powerful App For you Bussiness.</h1>
         <p className=''>From open source to pro services, Piqes helps you to build, deploy, test, and monitor apps.</p>
         <div className='Hero-buttons'>
            <a href="#" className='btn-appstore btn btn border align-items-xl-center '><AiOutlineApple className='mb-1'/>
                App Store</a>{" "}{" "}
            <a href="#" className=' btn-playstore btn btn border '><IoLogoGooglePlaystore className='mb-1'/>
                App Store</a>
         </div>
    </div>
    <div className="col-lg-7 col-md-12 col-12">
      <img src="https://preview.uideck.com/items/appvilla/assets/images/hero/phone.png" alt=""/>
    </div>
  </div>
</div>
</div>
</>
  )
}

export default HeroArea
