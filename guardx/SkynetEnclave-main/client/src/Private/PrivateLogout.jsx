import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function PrivateLogout() {
  let userid = localStorage.getItem("data") == null ? false : true;
  return (
    <>
      {userid ? (
        <div>
          <Navigate to="/admin/home" />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default PrivateLogout;