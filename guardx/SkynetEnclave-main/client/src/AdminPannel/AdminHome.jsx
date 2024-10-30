import React from "react";
import AdminNavbar from "./AdminNavbar";
import GetData from "../GetData/GetData";
import { Outlet } from "react-router-dom";

function AdminHome() {
  return (
    <>
      <div className="">
        <AdminNavbar />
        <div className="admin-content">
          <GetData />
        </div>
      </div>
    </>
  );
}

export default AdminHome;
