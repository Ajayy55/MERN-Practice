import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer/Footer";
import { Button } from "@mui/material";
import ImageUploadModal from "../../utils/ImageUploadModal";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { PORT } from "../../PORT/PORT";
import './style.css'

function Profile() {
  const localtoken =localStorage.getItem("Token") || sessionStorage.getItem("Token");
  const decode = jwtDecode(localtoken);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = useState(null);
  // const inputRef = useRef(null);

  useEffect(() => {
    fetchUser();
  },[open]);

  const fetchUser = async () => {
    try {
      
      const url = `${PORT}userProfile/${decode.id}`;
      const response = await axios.get(url);
      // console.log(response);
      setData(response.data);
      
    } catch (error) {
      console.log("error fetching user", error);
    }
  };

  return (
    <>
      <>    
        <div className="card shadow-lg mx-4 card-profile-bottom">
          <div className="card-body p-3">
            <div className="row gx-4">
              <div className="col-auto">
                <div className="avatar avatar-xl position-relative">
               { data?.profile ? <img
                    // src="../assets/img/team-1.jpg"
                    src={data?.profile}
                    alt="profile_image"
                    className="w-100 border-radius-lg shadow-sm"
                  />
                  :<img
                    // src="../assets/img/team-1.jpg"
                    src='https://avatar.iran.liara.run/public/boy?username=Ash'
                    alt="profile_image"
                    className="w-100 border-radius-lg shadow-sm"
                  />
               }  
                  
                </div>
                  
                {/* <span>
                <input type="file" ref={inputRef}/>

                </span> */}
                <span className="add_icon" onClick={handleOpen}><i className="ni ni-fat-add grid-58 text-warning text-lg  opacity-10"/><ImageUploadModal
                      open={open}
                      handleClose={handleClose}
                      uid={data?.id}
                    /></span>
              </div>
              <div className="col-auto my-auto">
                <div className="h-100">
                  <h5 className="mb-0 text-capitalize">{data?.username}</h5>
                  <p className="mb-0 font-weight-bold text-sm">
                    {data?.gender}
                  </p>
                  <div>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpen}
                    >
                      Change profile picture
                    </Button>
                    <ImageUploadModal
                      open={open}
                      handleClose={handleClose}
                      uid={data?.id}
                    /> */}
                  </div>
                </div>
              </div>

           
              <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                <div className="nav-wrapper position-relative end-0">
                  <ul className="nav nav-pills nav-fill p-1" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link mb-0 px-0 py-1 active d-flex align-items-center justify-content-center "
                        data-bs-toggle="tab"
                        href=""
                        role="tab"
                        aria-selected="true"
                      >
                        <i className="ni ni-app" />
                        <span className="ms-2">App</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link mb-0 px-0 py-1 d-flex align-items-center justify-content-center "
                        data-bs-toggle="tab"
                        href=""
                        role="tab"
                        aria-selected="false"
                      >
                        <i className="ni ni-email-83" />
                        <span className="ms-2">Messages</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link mb-0 px-0 py-1 d-flex align-items-center justify-content-center "
                        data-bs-toggle="tab"
                        href=""
                        role="tab"
                        aria-selected="false"
                      >
                        <i className="ni ni-settings-gear-65" />
                        <span className="ms-2">Settings</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header pb-0">
                  <div className="d-flex align-items-center">
                    <p className="mb-0">Edit Profile</p>
                    <button className="btn btn-primary btn-sm ms-auto">
                      Settings
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-uppercase text-sm">User Information</p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          Username
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue={data?.username}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          Email address
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          defaultValue={data?.email}
                          disabled
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          First name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="Jesse"
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          Last name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="Lucky"
                        />
                      </div>
                    </div> */}
                  </div>
                  <hr className="horizontal dark" />
                  <p className="text-uppercase text-sm">Contact Information</p>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          Address
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          City
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="New York"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          Country
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="United States"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          Postal code
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue={437300}
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="horizontal dark" />
                  <p className="text-uppercase text-sm">About me</p>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label
                          htmlFor="example-text-input"
                          className="form-control-label"
                        >
                          About me
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-profile">
                <img
                  src="../assets/img/bg-profile.jpg"
                  alt="Image placeholder"
                  className="card-img-top"
                />
                <div className="row justify-content-center">
                  <div className="col-4 col-lg-4 order-lg-2">
                    <div className="mt-n4 mt-lg-n6 mb-4 mb-lg-0">
                      <a href="">
                        <img
                          src="../assets/img/team-2.jpg"
                          className="rounded-circle img-fluid  border-2 border-white"
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-header text-center border-0 pt-0 pt-lg-2 pb-4 pb-lg-3">
                  <div className="d-flex justify-content-between">
                    <a
                      href=""
                      className="btn btn-sm btn-info mb-0 d-none d-lg-block"
                    >
                      Connect
                    </a>
                    <a
                      href=""
                      className="btn btn-sm btn-info mb-0 d-block d-lg-none"
                    >
                      <i className="ni ni-collection" />
                    </a>
                    <a
                      href=""
                      className="btn btn-sm btn-dark float-right mb-0 d-none d-lg-block"
                    >
                      Message
                    </a>
                    <a
                      href=""
                      className="btn btn-sm btn-dark float-right mb-0 d-block d-lg-none"
                    >
                      <i className="ni ni-email-83" />
                    </a>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div className="row">
                    <div className="col">
                      <div className="d-flex justify-content-center">
                        <div className="d-grid text-center">
                          <span className="text-lg font-weight-bolder">22</span>
                          <span className="text-sm opacity-8">Friends</span>
                        </div>
                        <div className="d-grid text-center mx-4">
                          <span className="text-lg font-weight-bolder">10</span>
                          <span className="text-sm opacity-8">Photos</span>
                        </div>
                        <div className="d-grid text-center">
                          <span className="text-lg font-weight-bolder">89</span>
                          <span className="text-sm opacity-8">Comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <h5>
                      Mark Davis<span className="font-weight-light">, 35</span>
                    </h5>
                    <div className="h6 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      Bucharest, Romania
                    </div>
                    <div className="h6 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      Solution Manager - Creative Tim Officer
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      University of Computer Science
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    </>
  );
}

export default Profile;
