import React from 'react'
import { CiCircleCheck } from "react-icons/ci";
import './style.css'

function Card({data}) {
    
  return (
    <div className="ss col-lg-3 col-md-6 col-12 border-rounded shadow p-4">
    <div className="single-table wow fadeInUp" data-wow-delay=".2s" >
        <div className="table-head">
            <h4 className="title">{data.heading}</h4>
            <p>All the basics for starting a new business</p>
            <div className="price">
                <h2 className="amount">${data.amount}<span className="duration">/mo</span></h2>
            </div>
            <div className="button">
                <a href="#" className="btn bg-dark w-100"><span className='text-light'>Buy {data.heading}</span>
               </a>
            </div>
        </div>
        <hr />
        <div className="table-content">
            <h4 className="middle-title fs-6 fw-bold">What's Included</h4>
            
            <ul className="table-list p-0">
                {
                  data.offers.map((el,index)=>{
                    return<li><CiCircleCheck className=''/>{" "}{el}</li>
                  })  
                }
                
                
            </ul>
        </div>
    </div>
</div>
  )
}

export default Card
