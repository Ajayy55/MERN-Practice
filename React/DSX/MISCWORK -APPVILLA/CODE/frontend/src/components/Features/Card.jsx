import React from "react";
import { GoShieldSlash } from "react-icons/go";
import "./Features.css";

function Card({ data }) {
  return (
    <>
      <div className="card col-lg-3 col-md-6 col-sm-12 border shadow pt-5">
        <div>
          <span className="card-icon p-3  ">
            <GoShieldSlash />
          </span>
        </div>
        <div>
          <h3 className="text-dark fw-bold fs-6 pt-4">{data.heading}</h3>
        </div>
        <div>
          <p className="text-secondary ">{data.desc}</p>
        </div>
      </div>
    </>
  );
}

export default Card;
