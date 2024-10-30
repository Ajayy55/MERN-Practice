import React, { useContext, useState } from "react";
import "./style.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { IoAddSharp } from "react-icons/io5";
import { LanguageContext } from "../../../lib/LanguageContext";
import { Formik, Form, Field } from "formik";
import { FaRegUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import axios from "axios";
import { BsDiagram2Fill } from "react-icons/bs";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { useEffect } from "react";
import { PORT } from "../../../Api/api";
import ListSocietyUser from "../ListingViewSocietyUser/ListSocietyUser";
import { ToastContainer, toast } from "react-toastify";
import { useMemo } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { MdPhotoLibrary } from "react-icons/md";
import { HiDocumentAdd } from "react-icons/hi";
import { FaImages } from "react-icons/fa";
import SocietyImages from "../AddSocietyImages/SocietyImages";
import { MdOutlineSaveAlt } from "react-icons/md";
import { useRef } from "react";
import SocietyDocuments from "../AddSocietyDocuments/SocietyDocuments";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const SocietyUser = ({ data }) => {
  const societyId = data;
  const { language } = useContext(LanguageContext);
  const [roleTitles, setRolesTitles] = useState([]);
  const [societyUser, setSocietyUser] = useState([]);
  const [value, setValue] = React.useState(0);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const getRole = localStorage.getItem("role");
  const rwaImagesRef = useRef(null);
  const rwaDocumentsRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const initialValues = {
    name: "",
    userPhoneNo: "",
    username: "",
    password: "",
    confirmpassword: "",
    role: "",
    defaultPermissionLevel: 4,
    isActive: true,
    createdBy: getRoleId,
    society_id: societyId,
    rwaImages: "",
    rwaDocuments: "",
  };
  // Custom validation logic
  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Full name is required";
    }
    if (!values.userPhoneNo) {
      errors.userPhoneNo = "Mobile number is required";
    }
    if (!values.username) {
      errors.username = "Email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!values.role) {
      errors.role = "Role is required";
    }

    // Custom logic for confirmPassword
    if (!values.confirmpassword) {
      errors.confirmpassword = "Confirm Password is required";
    } else if (values.password && values.confirmpassword !== values.password) {
      errors.confirmpassword = "Passwords do not match";
    }

    return errors;
  };
  // Get Role
  useEffect(() => {
    const getRoleData = async () => {
      try {
        let response = await axios.get(`${PORT}/roleGet`);
        const apiRoles = await response.data.roles;
        const filterDataRole = apiRoles.filter(
          (item) =>
            item.createdBy === getRoleId && item.defaultPermissionLevel !== 1
        );
        const rolesWithLessDefaultLevel = apiRoles.filter(
          (item) =>
            (item.defaultPermissionLevel > getRole ||
              item.roleTypeLevelSociety === "guardAccess") &&
            !(getRole === "1" && item.roleTypeLevelSociety === "guardAccess")
        );
        const extractedData = rolesWithLessDefaultLevel.map((role) => ({
          id: role._id,
          title: role.title,
          defaultPermissionLevel: role.defaultPermissionLevel,
        }));

        const filteredRolesData = filterDataRole.map((role) => ({
          id: role._id,
          title: role.title,
          defaultPermissionLevel: role.defaultPermissionLevel,
        }));
        // Combine the data while avoiding duplicates using a Set
        const roleIdSet = new Set();
        const combinedData = [...extractedData, ...filteredRolesData].filter(
          (role) => {
            if (roleIdSet.has(role.id)) {
              return false;
            } else {
              roleIdSet.add(role.id);
              return true;
            }
          }
        );
        setRolesTitles(combinedData);
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };
    getRoleData();
  }, []);
  // Form submission handler
  const onSubmit = async (values, { resetForm, setFieldValue }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key !== "rwaImages" && key !== "rwaDocuments") {
        formData.append(key, values[key]);
      }
    });
    if (values.rwaImages) {
      formData.append("rwaImages", values.rwaImages);
    }
    if (values.rwaDocuments) {
      for (let i = 0; i < values.rwaDocuments.length; i++) {
        formData.append("rwaDocuments", values.rwaDocuments[i]);
      }
    }
    try {
      const response = await axios.post(`${PORT}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.msg);
      getSocietyUser();
      resetForm();
      rwaImagesRef.current.value = "";
      rwaDocumentsRef.current.value = "";
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  const getSocietyUser = async () => {
    try {
      await axios.get(`${PORT}/getSignUpUser`).then(async (res) => {
        const response = await res.data.userData;
        const filterData = await response.filter(
          (item) => item.society_id === societyId
        );
        setSocietyUser(filterData.reverse());
      });
    } catch (error) {}
  };
  useMemo(() => {
    getSocietyUser();
  }, [societyId]);
  const handleUserDelete = (deletedUserId) => {
    setSocietyUser((prevUsers) =>
      prevUsers.filter((user) => user._id !== deletedUserId)
    );
  };
  return (
    <div>
      <div className="top-header-society-user">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              className="society-view-details-tabs"
            >
              <Tab
                label={
                  <div className="top-heading-label-title">
                    <IoPersonAdd /> &nbsp; Add RWA (Resident Welfare
                    Association)
                  </div>
                }
                {...a11yProps(0)}
              />

              <Tab
                label={
                  <div className="top-heading-label-title">
                    {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                    <MdPhotoLibrary /> &nbsp; Add Society Images and Videos
                  </div>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <div className="top-heading-label-title">
                    {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                    <HiDocumentAdd />
                    &nbsp; Add Society Documents
                  </div>
                }
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={onSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <Form className="add-rwa-detail-section">
                  {/* <h4 className="form-heading">
                    {language === "english"
                      ? "क्तिगत जानकारी"
                      : "Personal Information"}
                  </h4> */}
                  <div className="add-rwa-detail-title-div">
                    {" "}
                    {language === "english"
                      ? "क्तिगत जानकारी"
                      : "Personal Information"}
                  </div>
                  <div className="add-rwa-detail-inner-section">
                    {/* Full Name Field */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english" ? "पूरा नाम" : "Full Name"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-rwa">
                        <Field
                          type="text"
                          maxLength={35}
                          name="name"
                          placeholder="Enter your full name"
                        />
                        <FaRegUser className="input-icon" />
                      </div>
                      {errors.name && touched.name && (
                        <div className="error">{errors.name}</div>
                      )}
                    </div>

                    {/* Mobile Number Field */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english"
                          ? "मोबाइल नंबर"
                          : "Mobile Number"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-rwa">
                        <Field
                          type="number"
                          onInput={(e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                          name="userPhoneNo"
                          placeholder="Enter your mobile number"
                        />
                        <FaPhoneAlt className="input-icon" />
                      </div>
                      {errors.userPhoneNo && touched.userPhoneNo && (
                        <div className="error">{errors.userPhoneNo}</div>
                      )}
                    </div>

                    {/* Email Address Field */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english" ? "ईमेल पता" : "Email Address"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-rwa">
                        <Field
                          type="email"
                          name="username"
                          maxLength={40}
                          placeholder="Enter your email"
                        />
                        <MdOutlineEmail className="input-icon" />
                      </div>
                      {errors.username && touched.username && (
                        <div className="error">{errors.username}</div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english"
                          ? "पासवर्ड दर्ज करें"
                          : "Enter Password"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-rwa">
                        <Field
                          type="text"
                          name="password"
                          placeholder="Enter your password"
                          maxLength={30}
                        />
                        <TbPasswordUser className="input-icon" />
                      </div>
                      {errors.password && touched.password && (
                        <div className="error">{errors.password}</div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english"
                          ? "पासवर्ड की पुष्टि करें"
                          : "Confirm Password"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-rwa">
                        <Field
                          type="password"
                          name="confirmpassword"
                          placeholder="Confirm your password"
                          // Require if the password is filled
                          maxLength={30}
                        />
                        <FaPhoneAlt className="input-icon" />
                      </div>
                      {errors.confirmpassword && touched.confirmpassword && (
                        <div className="error">{errors.confirmpassword}</div>
                      )}
                    </div>
                    {/* Role Field */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english" ? "भूमिका" : "Role"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-rwa">
                        <Field as="select" name="role">
                          <option
                            value=""
                            label={
                              language === "english"
                                ? "अपनी भूमिका चुनें"
                                : "Select your role"
                            }
                          />

                          {roleTitles.map((role) => (
                            <option key={role.id} value={role.title}>
                              {" "}
                              {role.title}
                            </option>
                          ))}

                          {/* Add more roles as needed */}
                        </Field>
                        <AiOutlineUserSwitch className="input-icon" />
                      </div>
                      {errors.role && touched.role && (
                        <div className="error">{errors.role}</div>
                      )}
                    </div>
                    {/* Add Member Images */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english"
                          ? " सदस्य छवियां जोड़ें"
                          : "Add Rwa Member Images"}
                      </label>
                      <div className="input-with-icon-rwa">
                        <input
                          type="file"
                          name="rwaImages"
                          placeholder="Add Rwa Member Images"
                          maxLength={30}
                          ref={rwaImagesRef}
                          accept="image/*"
                          onChange={(event) => {
                            setFieldValue(
                              "rwaImages",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        <FaImages className="input-icon" />
                      </div>
                    </div>
                    {/* Add Member Documents */}
                    <div className="input-container-rwa">
                      <label>
                        {language === "english"
                          ? "सदस्य दस्तावेज़ जोड़ें"
                          : "Add Rwa Member Documents"}
                      </label>
                      <div className="input-with-icon-rwa">
                        <input
                          type="file"
                          name="rwaDocuments"
                          multiple
                          placeholder="Add Rwa Member Documents"
                          maxLength={30}
                          ref={rwaDocumentsRef}
                          accept="image/*"
                          onChange={(event) => {
                            setFieldValue(
                              "rwaDocuments",
                              event.currentTarget.files
                            );
                          }}
                        />
                        <HiDocumentAdd className="input-icon" />
                      </div>
                    </div>
                  </div>

                  <br />
                  {/* Buttons */}

                  <div className="add-society-rwa-form-action-buttons">
                    <button
                      type="submit"
                      className="add-society-rwa-save-button"
                    >
                      <MdOutlineSaveAlt className="add-society-rwa-form-action-buttons-icon" />{" "}
                      {language === "english" ? "सहेजें" : "Save"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            {/* Listing View For Society User List */}
            <ListSocietyUser
              data={societyUser}
              onUserDelete={handleUserDelete}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <SocietyImages data={societyId} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <SocietyDocuments data={societyId} />
          </CustomTabPanel>{" "}
        </Box>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SocietyUser;
