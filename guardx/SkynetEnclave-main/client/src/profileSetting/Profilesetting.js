import React, { useContext, useState } from "react";
import { useEffect } from "react";
import "./profile.css";
import { IoArrowBack } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PORT } from "../Api/api";
import { ThreeCircles } from "react-loader-spinner";
import { Formik, Form, Field } from "formik";
import { MdOutlineAdd } from "react-icons/md";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import GuardLayout from "../lib/GuardLayout";
import Navbar from "../Navbar/Navbar";
import { LanguageContext } from "../lib/LanguageContext";
import { FaRegUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { BsDiagram2Fill } from "react-icons/bs";
const Profilesetting = () => {
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [guardData, setGuardData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const id = JSON.parse(localStorage.getItem("guardId"));
  const [imageFile, setImageFile] = useState(null);

  const getGuardData = async () => {
    try {
      const response = await axios.get(`${PORT}/getEditWithSocietyUnion/${id}`);
      setGuardData(response.data.data[0]);
      setLoadingPermission(false);
    } catch (error) {
      console.error("Error fetching guard data:", error);
      setLoadingPermission(false);
    }
  };
  useEffect(() => {
    getGuardData();
  }, []);
  useEffect(() => {
    if (location.pathname === "/profileSetting") {
      const guardname = JSON.parse(localStorage.getItem("guardName"));
      if (!guardname) {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

  // Handle back function
  const handleBack = () => {
    navigate(-1);
  };

  // Handle edit mode toggle
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  const handleSubmit = async (values) => {
    try {
      const res = await axios.put(`${PORT}/editWithSocietyUnion/${id}`, values);
      setGuardData({ ...guardData, ...values });
      toast.success(res.data.message);
      toggleEditMode();
    } catch (error) {
      toast.success(error.response.data.message);
    }
  };
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to upload this image?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Upload",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        uploadImage(selectedFile);
      } else {
        console.log("Upload cancelled");
      }
    });
    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append("Ownerimage", file);
      await axios
        .put(`${PORT}/editImageGuard/${id}`, formData)
        .then((data) => {
          Swal.fire("Success", "Image uploaded successfully!", "success");
          getGuardData();
        })
        .catch((error) => {
          console.error("Error uploading image", error);
          Swal.fire(
            "Error",
            "Failed to upload image. Please try again later.",
            "error"
          );
        });
    };
  };
  const guardImage = guardData.Ownerimage?.replace("public/", "");
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name is too short - should be 2 chars minimum."),
    username: Yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      ),
    userPhoneNo: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits"),
  });
  return (
    <GuardLayout>
      <Navbar />
      <div className="guard-acces-main-div">
        {" "}
        {loadingPermission ? (
          <div className="three_circle_loader">
            <ThreeCircles
              visible={true}
              height={100}
              width={100}
              color="#5e72e4"
              ariaLabel="three-circles-loading"
            />
          </div>
        ) : (
          <>
            <div>
              <div className="edit_back">
                <div className="back_profile_text">
                  <IoArrowBack
                    onClick={handleBack}
                    className="back_profile_icon"
                  />
                  &nbsp;&nbsp;
                  <span>{language === "hindi" ? "Back" : " प्रोफ़ाइल "}</span>
                </div>
              </div>
            </div>
            <div className="personal-details-main-personal-section">
              <div className="top-header-profile-photo-section">
                <div className="top-left-section-div">
                  <div className="top-header-image-div">
                    {guardData?.Ownerimage?.length > 0 ? (
                      guardData?.Ownerimage && (
                        <img src={`/${guardImage}`} alt="" />
                      )
                    ) : (
                      <>
                        {(() => {
                          let initials = "";

                          if (guardData?.username) {
                            const words = guardData.username.split(" ");
                            if (words.length > 0) {
                              initials = words[0].substring(0, 1).toUpperCase();
                            }
                          }
                          return (
                            <>
                              <div className="">
                                <h1>{initials}</h1>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>

                  <div className="top-header-content-div">
                    <div className="top-header-content-div-h5">
                      {guardData.name}
                    </div>
                    <div className="top-header-content-div-h6">
                      {guardData.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
                <div className="top-right-section-div">
                  <div className="top-header-edit-div">
                    <button onClick={toggleEditMode}>
                      <CiEdit className="edit_setting_icon" />
                      &nbsp;
                      {language === "hindi" ? "Edit Profile" : "संपादित करें "}
                    </button>
                  </div>
                </div>
              </div>

              <div className="user-content-personal-section">
                {editMode ? (
                  <Formik
                    initialValues={{
                      name: guardData.name,
                      username: guardData.username,
                      userPhoneNo: guardData.userPhoneNo,
                    }}
                    // validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form className="edit-personal-detail-section">
                        <h4 className="form-heading">
                          {" "}
                          {language === "hindi"
                            ? "Personal Information"
                            : "क्तिगत जानकारी"}
                        </h4>
                        <div className="edit-personal-detail-inner-section">
                          {/* Full Name Field */}
                          <div className="input-container">
                            <label>
                              {" "}
                              {language === "hindi" ? "Full Name" : "पूरा नाम"}
                            </label>
                            <div className="input-with-icon">
                              <Field
                                type="text"
                                maxLength={35}
                                name="name"
                                required
                                placeholder="Enter your full name"
                              />
                              <FaRegUser className="input-icon" />
                            </div>
                            {/* {errors.superAdminName && touched.superAdminName ? (
                      <div className="error">{errors.superAdminName}</div>
                    ) : null} */}
                          </div>

                          {/* Email Address Field */}
                          <div className="input-container">
                            <label>
                              {" "}
                              {language === "hindi"
                                ? "Email Address"
                                : "ईमेल पता"}
                            </label>
                            <div className="input-with-icon">
                              <Field
                                type="email"
                                maxLength={35}
                                required
                                name="username"
                                placeholder="Enter your email"
                              />
                              <MdOutlineEmail className="input-icon" />
                            </div>
                            {/* {errors.username && touched.username ? (
                      <div className="error">{errors.username}</div>
                    ) : null} */}
                          </div>

                          {/* Mobile Number Field */}
                          <div className="input-container">
                            <label>
                              {" "}
                              {language === "hindi"
                                ? "Mobile Number"
                                : "मोबाइल नंबर"}
                            </label>
                            <div className="input-with-icon">
                              <Field
                                type="tel"
                                name="userPhoneNo"
                                required
                                maxLength={10}
                                placeholder="Enter your phone number"
                              />
                              <FaPhoneAlt className="input-icon" />
                            </div>
                            {/* {errors.userPhoneNo && touched.userPhoneNo ? (
                      <div className="error">{errors.userPhoneNo}</div>
                    ) : null} */}
                          </div>
                        </div>
                        <br />
                        {/* Buttons */}
                        <div className="form-action-buttons">
                          <button type="submit" className="save-button">
                            {" "}
                            {language === "hindi" ? "Save" : " सहेजें"}
                          </button>
                          <button
                            type="button"
                            className="cancel-button"
                            onClick={toggleEditMode}
                          >
                            {" "}
                            {language === "hindi" ? "Cancel" : " रद्द करें"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="user-personal-details-section">
                    <div className="user-personal-details-section-left">
                      <span>
                        <FaRegUser /> &nbsp;
                        {language === "hindi" ? "Username " : "नाम"}
                      </span>
                      <br />
                      <span>
                        <MdOutlineEmail /> &nbsp;
                        {language === "hindi" ? "Email address " : "ईमेल"}
                      </span>
                      <br />
                      <span>
                        <FaPhoneAlt />
                        &nbsp;{" "}
                        {language === "hindi" ? "Phone number " : "फ़ोन नं"}
                      </span>
                      <br />
                      <span>
                        <BsDiagram2Fill />
                        &nbsp; {language === "hindi" ? "Role " : "भूमिकाएँ"}
                      </span>
                    </div>
                    <div className="user-personal-details-section-right">
                      <b>{guardData.name}</b>
                      <br />
                      <b>{guardData.username}</b>
                      <br />
                      <b>{guardData.userPhoneNo}</b>
                      <br />
                      <b>{guardData.role}</b>
                      <br />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <ToastContainer />
        <div className="top-header-edit-image-logo">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="profile-image-upload"
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "10%",
              height: "10%",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="profile-image-upload"
            className="top-header-edit-image-icon-label"
          >
            <CiEdit className="top-header-edit-image-icon" />
          </label>
        </div>
      </div>
    </GuardLayout>
  );
};

export default Profilesetting;
