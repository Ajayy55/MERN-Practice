import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./style.css";
function Backbutton() {
  const navigate = useNavigate();
  return (
    <>
      <div className="back-btn">
        <button onClick={() => navigate(-1)}>&#10096;</button>
      </div>
    </>
  );
}

export default Backbutton;
