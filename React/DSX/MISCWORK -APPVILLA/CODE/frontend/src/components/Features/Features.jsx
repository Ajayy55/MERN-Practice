import React from "react";
import "./Features.css";
import Card from "./Card";
function Features() {

    const features=[
        {
        heading:"Push to Deploy",
        desc:"It is a long established fact that a reader will be distracted by the readable content of a page at its layout."
        },
        {
        heading:"SSL Certificates",
        desc:"It is a long established fact that a reader will be distracted by the readable content of a page at its layout."
        },
        {
        heading:"Simple Queues",
        desc:"It is a long established fact that a reader will be distracted by the readable content of a page at its layout."
        },
        {
        heading:"Advanced Security",
        desc:"It is a long established fact that a reader will be distracted by the readable content of a page at its layout."
        },
        {
        heading:"Powerful API",
        desc:"It is a long established fact that a reader will be distracted by the readable content of a page at its layout."
        },
        {
        heading:"Database Backups",
        desc:"It is a long established fact that a reader will be distracted by the readable content of a page at its layout."
        },
];
  return (
    <div className="features bg-light pt-5" id="features">
      <div className="container align-items-center">
        <div className="row align-items-xl-center">
          <div className="col-lg-12 col-md-12 col-12">
            <div className="features-section text-center m">
              <h3 className="">FEATURES</h3>
              <h2 className="">Your Experience Gets Better And Better<br/>
                Over Time.</h2>
                <p className="fs-6">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</p>
            </div>
          </div>
        </div>
            
        <div className="row d-flex justify-content-center mt-5  gap-3">
               {
                    features.map((el,index)=>{
                       return  <Card data={el} key={index}/>
                    })
                }       
        </div></div>
   
    </div>
  );
}

export default Features;
