import React,{useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { jwtDecode } from "jwt-decode";




function Navbar({ toggleSidenav }) {
// function Navbar() {
  const navigate =useNavigate();
  const token=localStorage.getItem('token')
  const location = useLocation();

  // Format the path for better display
  const formatPath = (path) => {
    const formatted = path
      .replace("/", "") // Remove the leading slash
      .split("/") // Split by slashes
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)) // Capitalize each segment
      .join(" > "); // Join with an arrow for better visual hierarchy
    return formatted || "Home"; // Default to 'Home' if the path is empty
  };
  if(token){
  const decode = jwtDecode(token);
  // console.log(decode);
  }
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login')
  }

  return (
    <>
        <nav className="navbar p-0 fixed-top d-flex flex-row navbar-expand-lg">
        <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
      {/* <nav className="navbar p-0 fixed-top d-flex flex-row"> */}
          <a className="navbar-brand brand-logo-mini" href="">
            {/* <img src="../../../assets/images/logo-mini.svg" alt="logo" /> */}G
          </a>
        </div>
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch justify-content-end">
        {/* {formatPath(location.pathname)} */}
          {/* <button
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            data-toggle="minimize"
          >
            <span className="mdi mdi-menu" />
          </button> */}
          {/* <ul className="navbar-nav w-100">
            <li className="nav-item w-100">
              <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products"
                />
              </form>
            </li>
          </ul> */}
          <ul className="navbar-nav navbar-nav-right">
            {/* <li className="nav-item dropdown d-none d-lg-block">
              <a
                className="nav-link btn btn-success create-new-button"
                id="createbuttonDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                href="#"
              >
                + Create New Project
              </a>
              <div
                className="dropdown-menu dropdown-menu-end navbar-dropdown preview-list"
                aria-labelledby="createbuttonDropdown"
              >
                <h6 className="p-3 mb-0">Projects</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-file-outline text-primary" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1">
                      Software Development
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-web text-info" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1">
                      UI Development
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-layers text-danger" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1">
                      Software Testing
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <p className="p-3 mb-0 text-center">See all projects</p>
              </div>
            </li>
            <li className="nav-item nav-settings d-none d-lg-block">
              <a className="nav-link" href="#">
                <i className="mdi mdi-view-grid" />
              </a>
            </li> */}
            {/* <li className="nav-item dropdown border-left">
              <a
                className="nav-link count-indicator dropdown-toggle"
                id="messageDropdown"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="mdi mdi-email" />
                <span className="count bg-success" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end navbar-dropdown preview-list"
                aria-labelledby="messageDropdown"
              >
                <h6 className="p-3 mb-0">Messages</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="../../../assets/images/faces/face4.jpg"
                      alt="image"
                      className="rounded-circle profile-pic"
                    />
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1">
                      Mark send you a message
                    </p>
                    <p className="text-muted mb-0"> 1 Minutes ago </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="../../../assets/images/faces/face2.jpg"
                      alt="image"
                      className="rounded-circle profile-pic"
                    />
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1">
                      Cregh send you a message
                    </p>
                    <p className="text-muted mb-0"> 15 Minutes ago </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="../../../assets/images/faces/face3.jpg"
                      alt="image"
                      className="rounded-circle profile-pic"
                    />
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1">
                      Profile picture updated
                    </p>
                    <p className="text-muted mb-0"> 18 Minutes ago </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <p className="p-3 mb-0 text-center">4 new messages</p>
              </div>
            </li>
            <li className="nav-item dropdown border-left">
              <a
                className="nav-link count-indicator dropdown-toggle"
                id="notificationDropdown"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="mdi mdi-bell" />
                <span className="count bg-danger" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end navbar-dropdown preview-list"
                aria-labelledby="notificationDropdown"
              >
                <h6 className="p-3 mb-0">Notifications</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-calendar text-success" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Event today</p>
                    <p className="text-muted ellipsis mb-0">
                      {" "}
                      Just a reminder that you have an event today{" "}
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-cog text-danger" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Settings</p>
                    <p className="text-muted ellipsis mb-0">
                      {" "}
                      Update dashboard{" "}
                    </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-link-variant text-warning" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Launch Admin</p>
                    <p className="text-muted ellipsis mb-0"> New admin wow! </p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <p className="p-3 mb-0 text-center">See all notifications</p>
              </div>
            </li> */}
            <li className="nav-item dropdown">
              <a
                className="nav-link"
                id="profileDropdown"
                href="#"
                data-bs-toggle="dropdown"
              >
                <div className="navbar-profile">
                  <img
                    className="img-xs rounded-circle"
                    src="../../../assets/images/faces/face15.jpg"
                    alt=""
                  />
                  <p className="mb-0 d-none d-sm-block navbar-profile-name">
                    {/* {decode?.username} */}
                  </p>
                  <i className="mdi mdi-menu-down d-none d-sm-block" />
                </div>
              </a>
              <div
                className="dropdown-menu dropdown-menu-end navbar-dropdown preview-list"
                aria-labelledby="profileDropdown"
              >
                <h6 className="p-3 mb-0">Profile</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-fingerprint text-success" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Attendance</p>
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item" onClick={handleLogout}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-logout text-danger" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1" >Log out</p>
                  </div>
                </a>
                {/* <div className="dropdown-divider" />
                <p className="p-3 mb-0 text-center">Advanced settings</p> */}
              </div>
            </li>
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            data-toggle="offcanvas"
            // data-bs-toggle="offcanvas"
            onClick={toggleSidenav}
          >
            <span className="mdi mdi-format-line-spacing" />
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
