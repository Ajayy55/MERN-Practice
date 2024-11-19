import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back", customStyle = {}, className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Goes to the previous page
  };

  return (
    <button
      onClick={handleBack}
      className={`btn btn-secondary ${className}`}
      style={{ ...customStyle }}
    >
  <i className="mdi mdi-keyboard-return" /> Back </button>
  );
};

export default BackButton;
