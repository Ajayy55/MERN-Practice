import React from 'react'
import './Overview.css'
import { GoShieldSlash } from "react-icons/go";

function Overview() {
    return (
        <>
            <div className="container align-items-sm-center" id='overview'>
                <div className="info-one">
                    <div className="row justify-content-center align-items-sm-center py-5">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="info-text wow fadeInLeft align-items-sm-center m-5 px-5" data-wow-delay=".3s">
                                <div className="main-icon">
                                    <span className='card-icon p-3  '><GoShieldSlash /></span>
                                </div>
                                <h2 className='py-4 fs-4'>1,25,000 Customers Using The Application!</h2>
                                <p className='small'>Collaborate over projects with your team and clients optimised for mobile and tablet
                                    don't
                                    let slow page speeds drive our innovative platform empowers anyone to convert clicks
                                    ou'll
                                    publish your first landing page in minutes.</p>
                                <div className="btn">
                                    <a href="#" className="btn info-button">Get Started</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="info-image wow fadeInRight" data-wow-delay=".5s">
                                <img className="ss1" src="https://preview.uideck.com/items/appvilla/assets/images/app-ss/app-ss1.png" alt="#" />
                            </div>
                        </div>
                    </div>
                    <div className="info-one style2 justify-">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-12">
                                <div className="info-image wow fadeInLeft" data-wow-delay=".3s" >
                                    <img className="ss1" src="https://preview.uideck.com/items/appvilla/assets/images/app-ss/app-ss2.png" alt="#" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-12">

                                <div className="info-text wow fadeInRight" data-wow-delay=".5s">
                                    <div className="main-icon">
                                        <span className='card-icon p-3  '><GoShieldSlash /></span>
                                    </div>
                                    <h2 className='py-4'>Seamless Loyalty</h2>
                                    <p className='small'>Collaborate over projects with your team and clients optimised for mobile and tablet
                                        don't
                                        let slow page speeds drive our innovative platform empowers anyone to convert clicks
                                        ou'll
                                        publish your first landing page in minutes.</p>
                                    <div className="button">
                                        <a href="#" className="btn info-button">Get Started</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview
