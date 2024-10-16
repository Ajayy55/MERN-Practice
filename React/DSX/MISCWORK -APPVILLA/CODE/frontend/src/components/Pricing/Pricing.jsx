import React from 'react'
import './style.css'
import Card from './Card';
function Pricing() {
    const plans=[
            {
            heading:"Hobby",
            amount:12,
            offers:["Cras justo odio.","Dapibus ac facilisis in.","Morbi leo risus.","Potenti felis, in cras ligula."]
        },  {
            heading:"Freelancer",
            amount:24,
            offers:["Cras justo odio.","Dapibus ac facilisis in.","Morbi leo risus.","Potenti felis, in cras ligula."]
        },
        {
            heading:"Startup",
            amount:32,
            offers:["Cras justo odio.","Dapibus ac facilisis in.","Morbi leo risus.","Potenti felis, in cras ligula."]
        },  {
            heading:"Enterprise",
            amount:48,
            offers:["Cras justo odio.","Dapibus ac facilisis in.","Morbi leo risus.","Potenti felis, in cras ligula."]
        },
];

    return (
        <>
            <section id="pricing" className="pricing-table section">
                <div className="container">
                    <div className="row m-5 justify-content-center">
                        <div className="col-12">
                            <div className="section-title ">
                                <h3 className="wow zoomIn" data-wow-delay=".2s" >PRICING</h3>
                                <h2 className="wow fadeInUp" data-wow-delay=".4s" >Pricing Plan</h2>
                                <p className="wow fadeInUp" data-wow-delay=".6s" >There are many variations of passages of Lorem
                                    Ipsum available, but the majority have suffered alteration in some form.</p>
                            </div>
                        </div>
                    </div>  
                    <div className="m-5">
                    <div className="row d-flex flex-wrap justify-content-center">
                        {
                        plans.map((el,index)=>{
                            return <Card data={el} key={index}/>
                        }) 
                        }
                    </div>
                        </div>
                    </div>

            </section>
        </>
    )
}

export default Pricing
