import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import AdminNavbar from "../AdminPannel/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./adminCrud.css";
import { PORT } from "../Api/api";
import { useEffect } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { blue, pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
const AddAdmin = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const getRoleLevel = localStorage.getItem("roleLevel");
  const getRole = localStorage.getItem("role");
  const getValidationMessage = (language, englishMessage, hindiMessage) => {
    return language === "english" ? hindiMessage : englishMessage;
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    username: Yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      ),
    userPhoneNo: Yup.string()
      .required("Phone number is required")
      .matches(
        /^[0-9]{10}$/,
        "Number must be exactly 10 digits and only numeric values"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmpassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    role: Yup.string().required("Role is required"),
  });
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      userPhoneNo: "",
      password: "",
      confirmpassword: "",
      role: "",
      isActive: true,
      createdBy: getRoleId,
      Ownerimage: null,
      defaultPermissionLevel: getRoleLevel,
      society_id: society_id,
      rwaImages: "",
      rwaDocuments: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
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
        await axios.post(`${PORT}/signup`, formData).then((res) => {
          toast.success(res.data.msg);

          setTimeout(() => {
            navigate(-1);
          }, 2000);
        });
      } catch (error) {
        toast.error(error.response.data.msg);
        console.log(error, "error");
      }
    },
  });
  //setToggle Functionality
  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: blue[600],
      "&:hover": {
        backgroundColor: alpha(blue[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: blue[600],
    },
  }));

  const label = { inputProps: { "aria-label": "Color switch demo" } };
  const handleActivationToggle = () => {
    formik.setFieldValue("isActive", !formik.values.isActive);
  };
  const [rolesTitle, setRolesTitle] = useState([]);
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
            item.defaultPermissionLevel > getRole ||
            item.roleTypeLevelSociety == "guardAccess"
        );
        const extractedData = rolesWithLessDefaultLevel.map((role) => ({
          id: role._id, // Assuming role has an id field
          title: role.title, // Assuming role has a title field
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
        setRolesTitle(combinedData);
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };
    getRoleData();
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? "Add New Users " : "नये उपयोगकर्ता जोड़ें"}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="roles_main_div">
          <form onSubmit={formik.handleSubmit} className="form_roles form_user">
            <div>
              <label htmlFor="name" className="editLabel">
                {language === "hindi" ? "Name" : "ईमेल"}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Name"
                className="edit-input"
                maxLength="40"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="errorAdmin"> {formik.errors.name}</div>
              ) : null}
            </div>

            <br />
            <div>
              <label htmlFor="userPhoneNo" className="editLabel">
                {language === "hindi" ? "Phone Number" : "फ़ोन नंबर"}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="userPhoneNo"
                name="userPhoneNo"
                value={formik.values.userPhoneNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Phone Number"
                className="edit-input"
                maxLength="35"
              />
              {formik.touched.userPhoneNo && formik.errors.userPhoneNo ? (
                <div className="errorAdmin"> {formik.errors.userPhoneNo}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="username" className="editLabel">
                {language === "hindi" ? " Email" : "ईमेल"}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Username"
                className="edit-input"
                maxLength="40"
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="errorAdmin"> {formik.errors.username}</div>
              ) : null}
            </div>
            <br />
            <div className="toggle_button">
              <label htmlFor="password" className="editLabel">
                {language === "hindi" ? "Password" : "पासवर्ड "}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
                className="edit-input"
                maxLength="35"
              />
              <div
                className="togglePasswordVisibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="errorAdmin"> {formik.errors.password}</div>
              ) : null}
            </div>
            <br />
            <div>
              <label htmlFor="confirmpassword" className="editLabel">
                {language === "hindi"
                  ? " Confirm Password"
                  : "पासवर्ड की पुष्टि कीजिये "}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="confirmpassword"
                name="confirmpassword"
                value={formik.values.confirmpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm Password"
                className="edit-input"
                maxLength="35"
              />
              {formik.touched.confirmpassword &&
              formik.errors.confirmpassword ? (
                <div className="errorAdmin">
                  {" "}
                  {formik.errors.confirmpassword}
                </div>
              ) : null}
            </div>
            <br />
            <div>
              <label htmlFor="role" className="editLabel">
                {language === "hindi" ? " Role" : "भूमिका "}
                <span className="Star_color">*</span>
              </label>
              <br />
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="edit-input"
              >
                <option
                  value=""
                  label={language === "hindi" ? "Select role" : "भूमिका चुनें"}
                />
                {rolesTitle?.map((role) => (
                  <option key={role.id} value={role.title}>
                    {role.title}
                  </option>
                ))}
              </select>
              {formik.touched.role && formik.errors.role ? (
                <div className="errorAdmin"> {formik.errors.role}</div>
              ) : null}
            </div>
            <br />

            <div className="activeDeactive_div">
              <label htmlFor="isActive" className="editLabel">
                {language === "hindi" ? "  Status" : "स्थिति "}
              </label>
              <br />
              <PinkSwitch
                {...label}
                checked={formik.values.isActive}
                onChange={handleActivationToggle}
              />
            </div>
            <br />
            <div className="role_submit_btn">
              <button
                className="edit-button edit_btn_create_role"
                type="submit"
              >
                {language === "hindi" ? " Create User" : " उपयोगकर्ता बनाइये "}
              </button>
            </div>
          </form>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default AddAdmin;
