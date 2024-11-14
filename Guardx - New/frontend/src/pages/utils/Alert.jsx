import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const useAlert = () => {
  const navigate = useNavigate();

  const successAlert = (msg) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: msg,
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const errorAlert = (msg) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: msg,
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return { successAlert, errorAlert };
};
