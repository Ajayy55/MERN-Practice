import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./layout.css"
const AddBackbtn = () => {
    const navigate=useNavigate()
  return (
    <div>
      <div className="backbutton_all">
        <div className="add_society_back_button">
          <button onClick={() => navigate(-1)}>
            {" "}
            <IoMdArrowBack className="regular_entries_back_btn" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBackbtn;
