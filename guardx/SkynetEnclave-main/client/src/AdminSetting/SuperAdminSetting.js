import React, { useState } from "react";
import { useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PORT } from "../Api/api";
import { ThreeCircles } from "react-loader-spinner";
import { Formik, Form, Field } from "formik";
import { MdOutlineAdd } from "react-icons/md";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
const SuperAdminSetting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [guardData, setGuardData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  const id = JSON.parse(localStorage.getItem("roleId"));
  useEffect(() => {
    const getGuardData = async () => {
      try {
        const response = await axios.get(
          `${PORT}/getEditWithSocietyUnion/${id}`
        );
        console.log(response, " response");
        setGuardData(response.data.data[0]);
        setLoadingPermission(false);
      } catch (error) {
        console.error("Error fetching guard data:", error);
        setLoadingPermission(false);
      }
    };
    getGuardData();
  }, [guardData]);
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
      className: "swal-on-top",
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
      formData.append("rwaImages", file);
      await axios
        .put(`${PORT}/editUser/${id}`, formData)
        .then((data) => {
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
  const guardImage = guardData?.rwaImages?.replace("public/", "");
  return (
    <div>
      <div className="profile_setting_main_div">
        {loadingPermission ? (
          <div className="three_circle_loader">
            <ThreeCircles
              visible={true}
              height={100}
              width={100}
              color="#E11D48"
              ariaLabel="three-circles-loading"
            />
          </div>
        ) : (
          <div className="profile_inner_div">
            <div className="profile-photo">
              <div className="back_profile">
                <IoArrowBack
                  onClick={handleBack}
                  className="back_profile_icon"
                />
                &nbsp;&nbsp;<span>Profile</span>
              </div>

              <div className="profile-image-div ">
                {guardData.rwaImages ? (
                  guardData.rwaImages && <img src={`${guardImage}`} alt="" />
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
                          <div className="heading_profile_div guardLogoImage">
                            <h1>{initials}</h1>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
              <div className="profile_image_main">
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
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="profile-image-upload"
                  className="add-image-label"
                >
                  <CiEdit className=" add-image-icon" />
                </label>
              </div>
            </div>
            <div className="user-content">
              {editMode ? (
                <Formik
                  initialValues={{
                    ownerName: guardData.name,
                    username: guardData.username,
                    contactName: guardData.contactName,
                  }}
                  onSubmit={handleSubmit}
                >
                  <Form className="form_setting">
                    <div className="input_setting">
                      <label>Ownername</label>
                      <br />
                      <Field
                        type="text"
                        className="setting_input"
                        name="ownerName"
                      />
                    </div>
                    <div className="input_setting">
                      <label>Useremail</label>
                      <br />
                      <Field
                        type="text"
                        className="setting_input"
                        name="username"
                      />
                    </div>
                    <div>
                      <label>Phone Number</label>
                      <br />
                      <Field
                        type="text"
                        className="setting_input"
                        name="contactName"
                      />
                    </div>
                    <br />
                    <div className="action-button_setting">
                      <button type="submit">Save</button>
                      <button type="button" onClick={toggleEditMode}>
                        Cancel
                      </button>
                    </div>
                  </Form>
                </Formik>
              ) : (
                <div className="user-content">
                  <div>
                    <span>Name:</span>
                    <br />
                    <span>Useremail:</span>
                    <br />
                    <span>PhonNo:</span>
                    <br />
                    <span>Role:</span>
                  </div>
                  <div className="guardData_div">
                    <b>{guardData.name}</b>
                    <br />
                    <b>{guardData.username}</b>
                    <br />
                    <b>{guardData.contactName}</b>
                    <br />
                    <b>{guardData.role}</b>
                    <br />
                  </div>
                </div>
              )}
            </div>
            <div className="action-button">
              <button onClick={toggleEditMode}>
                <CiEdit className="edit_setting_icon" />
                &nbsp;Edit
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuperAdminSetting;
