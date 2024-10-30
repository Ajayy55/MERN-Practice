import React from "react";
import { useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { PORT } from "../../Api/api";
import { ThreeCircles } from "react-loader-spinner";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { LanguageContext } from "../../lib/LanguageContext";
import "./details.css";
import { FaRegUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { FaRegAddressCard } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { FaBuildingUser } from "react-icons/fa6";
import { TbPhone } from "react-icons/tb";
import { ImUser } from "react-icons/im";
import { MdOutlineAppRegistration } from "react-icons/md";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import { IoIosEye } from "react-icons/io";
import Modal from "./Modal";

const EditSocietyDetails = () => {
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [guardData, setGuardData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const id = JSON.parse(localStorage.getItem("society_id"))|| null;;
  const [userRole, setUserRole] = useState();
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const getGuardData = async () => {
    try {
      const response = await axios.get(`${PORT}/getSocietyData`);
      const res = response.data.societyData;
      const filterSociety = res.filter((filter) => filter._id === society_id);
      setGuardData(filterSociety[0]);
      setLoadingPermission(false);
    } catch (error) {
      console.error("Error fetching guard data:", error);
      setLoadingPermission(false);
    }
  };
  useEffect(() => {
    getGuardData();
  }, []);
  // Effect to check if logged in
  useEffect(() => {
    if (location.pathname === "/profileSetting") {
      const guardname = JSON.parse(localStorage.getItem("guardName"));
      if (!guardname) {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSubmit = async (values) => {
    try {
      const res = await axios.put(`${PORT}/editWithSocietyUnion/${id}`, values);
      setGuardData({ ...guardData, ...values });
      getGuardData();
      toast.success(res.data.message);
      toggleEditMode();
    } catch (error) {
      console.error("Error updating guard data:", error);
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
      formData.append("societyLogo", file);
      await axios
        .put(`${PORT}updatedSocietyLogo/${id}`, formData)
        .then((data) => {
          getGuardData();
          Swal.fire("Success", "Image uploaded successfully!", "success");
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

  const guardImage = guardData?.societyLogo
    ? guardData.societyLogo.replace("public", "")
    : "";

  useEffect(() => {
    switch (guardData.defaultPermissionLevel) {
      case 4:
        setUserRole("Society Admin");
        break;
      case 3:
        setUserRole("Super Admin");
        break;
      case 2:
        setUserRole("Admin");
        break;

      default:
        break;
    }
  }, [guardData]);
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
    <div>
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
               
              </div>
            </div>
          </div>
          <div className="personal-details-main-personal-section">
            <div className="top-header-profile-photo-section">
              <div className="top-left-section-div">
                <div className="top-header-image-div">
                  {guardData?.societyLogo?.length > 0 ? (
                    guardData?.societyLogo && (
                      <img src={`${guardImage}`} alt="" />
                    )
                  ) : (
                    <>
                      {(() => {
                        let initials = "";

                        if (guardData?.name) {
                          const words = guardData.name.split(" ");
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
                <div className="top-header-view-div">
                  <Modal data={guardData} />
                </div>
                <Tooltip
              title={
                language === "english" ? "समाज प्रोफ़ाइल संपादित करें" : "Edit society profile"
              }
              placement="top"
              arrow
            >
                <div className="top-header-edit-div">
                  <button onClick={toggleEditMode}>
                    <CiEdit className="edit_setting_icon" />
                    &nbsp;
                    {language === "hindi" ? "Edit Profile" : "संपादित करें "}
                  </button>
                </div>
                </Tooltip>
              </div>
            </div>

            <div className="user-content-personal-section">
              {editMode ? (
                <Formik
                  initialValues={{
                    name: guardData.name,
                    username: guardData.username,
                    societyContactNumber: guardData.societyContactNumber,
                    address: guardData.address,
                    contactName: guardData.contactName,
                    secretaryName: guardData.secretaryName,
                    alternateNumber: guardData.alternateNumber,
                    secretaryContact: guardData.secretaryContact,
                    ownerName: guardData.ownerName,
                    userPhoneNo: guardData.userPhoneNo,
                    societyRegistration: guardData.societyRegistration,
                    societyHouseList: guardData.societyHouseList,
                    superAdminName: guardData.superAdminName,
                    superAdminContactNo: guardData.superAdminContactNo,
                  }}
                  // validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="edit-personal-detail-section">
                      <h4 className="form-heading">
                        {language === "hindi"
                          ? "Society Information "
                          : "सोसायटी की जानकारी"}
                      </h4>
                      <div className="edit-personal-detail-inner-section">
                        {/* Full Name Field */}
                        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />{" "}
                        <div className="input-container">
                          <label>
                            {language === "hindi" ? "Name " : "नाम"}{" "}
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
                        </div>
                        {/* Email Address Field */}
                        <div className="input-container">
                          <label>
                            {" "}
                            {language === "hindi" ? "Address " : "पता"}
                          </label>
                          <div className="input-with-icon">
                            <Field
                              type="text"
                              maxLength={50}
                              required
                              name="address"
                              placeholder="Enter your address"
                            />
                            <FaRegAddressCard className="input-icon" />
                          </div>
                        </div>
                        {/* Mobile Number Field */}
                        <div className="input-container">
                          <label>
                            {language === "hindi"
                              ? "Mobile Number"
                              : "मोबाइल नंबर"}
                          </label>
                          <div className="input-with-icon">
                            <Field
                              type="tel"
                              required
                              name="societyContactNumber"
                              maxLength={10}
                              pattern="[0-9]{10}"
                              placeholder="Enter your phone number"
                            />
                            <FaPhoneAlt className="input-icon" />
                          </div>
                        </div>
                        <div className="input-container">
                          <label>
                            {" "}
                            {language === "hindi"
                              ? "Registration number"
                              : "पंजीकरण संख्या"}
                          </label>
                          <div className="input-with-icon">
                            <Field
                              type="tel"
                              required
                              maxLength={40}
                              name="societyRegistration"
                              placeholder="Enter your registration number"
                            />
                            <MdOutlineAppRegistration className="input-icon" />
                          </div>
                        </div>
                        <div className="input-container">
                          <label>
                            {" "}
                            {language === "hindi"
                              ? "Society house list "
                              : "सोसायटी घरों की सूची"}
                          </label>
                          <div className="input-with-icon">
                            <Field
                              type="tel"
                              required
                              maxLength={15}
                              name="societyHouseList"
                              placeholder="Enter house list"
                            />
                            <FaHouseChimneyWindow className="input-icon" />
                          </div>
                        </div>
                      </div>
                      <br />
                      {/* Buttons */}
                      <div className="form-action-buttons">
                        <button type="submit" className="save-button">
                          {language === "hindi" ? "Save" : " सहेजें"}
                        </button>
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={toggleEditMode}
                        >
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
                      <BiSolidBuildingHouse /> &nbsp;
                      {language === "hindi" ? "Name " : "नाम"}
                    </span>
                    <br />
                    <span>
                      <FaRegAddressCard /> &nbsp;
                      {language === "hindi" ? " Address " : "ईमेल"}
                    </span>
                    <br />
                    <span>
                      <FaPhoneAlt />
                      &nbsp;{" "}
                      {language === "hindi" ? "Phone number " : "फ़ोन नं"}
                    </span>

                    <br />
                    <span>
                      <MdOutlineAppRegistration />
                      &nbsp;{" "}
                      {language === "hindi"
                        ? "Registration number "
                        : "पंजीकरण संख्या"}
                    </span>
                    <br />
                    <span>
                      <FaHouseChimneyWindow />
                      &nbsp;{" "}
                      {language === "hindi"
                        ? "Society house list"
                        : "सोसायटी घरों की सूची"}
                    </span>
                    <br />
                  </div>
                  <div className="user-personal-details-section-right">
                    <b>{guardData.name}</b>
                    <br />
                    <b>{guardData.address}</b>
                    <br />
                    <b>{guardData.societyContactNumber}</b>
                    <br />

                    <b>{guardData.societyRegistration}</b>
                    <br />
                    <b>{guardData.societyHouseList}</b>
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
  );
};

export default EditSocietyDetails;
