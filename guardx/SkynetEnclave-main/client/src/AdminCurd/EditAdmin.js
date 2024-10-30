import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import AdminNavbar from "../AdminPannel/AdminNavbar";
import { useNavigate, useParams } from "react-router-dom";
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
const EditAdmin = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const paramsId = useParams();
  const id = paramsId.id;
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .max(40, "Username must be at most 40 characters long"),
    phon: Yup.string()
      .required("Phone number is required")
      .matches(
        /^[0-9]{10}$/,
        "Number must be exactly 10 digits and only numeric values"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      phon: "",
      password: "",
      role: "",
      isActive: true,
    },
    validationSchema: validationSchema,
    enableReinitialize: true, // Add this line
    onSubmit: async (values) => {
      const editValues = {
        username: values.username,
        userPhoneNo: values.phon || values.contactName,
        password: values.password,
        role: values.role,
        isActive: values.isActive,
      };
      try {
        await axios
          .put(`${PORT}/editWithSocietyUnion/${id}`, editValues)
          .then((res) => {
            console.log(res.data.message);
            toast.success(res.data.message);
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          });

        console.log("Form Values:", values);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleActivationToggle = () => {
    formik.setFieldValue("isActive", !formik.values.isActive);
  };
  const [rolesTitle, setRolesTitle] = useState([]);
  const getRole = localStorage.getItem("role");
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
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
  //handle Edit Data
  useEffect(() => {
    const getEditData = async () => {
      try {
        await axios.get(`${PORT}/getEditWithSocietyUnion/${id}`).then((res) => {
          console.log(res);
          const userData = res.data.data;
          formik.setValues({
            username: userData[0].username,
            phon: userData[0].userPhoneNo || userData[0].contactName, // Change userPhoneNo to phon
            password: userData[0].password,
            role: userData[0].role,
            isActive: userData[0].isActive,
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    getEditData();
  }, [id]);

  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi"
              ? "Edit Users"
              : "उपयोगकर्ताओं को संपादित करें"}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="roles_main_div">
          <form onSubmit={formik.handleSubmit} className="form_roles form_user">
            <div>
              <label htmlFor="username" className="editLabel">
                {language === "hindi" ? "  Username" : "उपयोगकर्ता नाम"}
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
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="errorAdmin"> {formik.errors.username}</div>
              ) : null}
            </div>
            <br />
            <div>
              <label htmlFor="phon" className="editLabel">
                {language === "hindi" ? "Phone Number" : "फ़ोन नंबर"}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="phon"
                name="phon"
                value={formik.values.phon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Phone Number"
                className="edit-input"
              />
              {formik.touched.phon && formik.errors.phon ? (
                <div className="errorAdmin"> {formik.errors.phon}</div>
              ) : null}
            </div>
            <br />
            <div style={{ position: "relative" }}>
              <label htmlFor="password" className="editLabel">
                {language === "hindi" ? "Password" : "पासवर्ड"}
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
              />
              <span
                className="togglePasswordVisibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> :  <FaEyeSlash />}
              </span>
              {formik.touched.password && formik.errors.password ? (
                <div className="errorAdmin"> {formik.errors.password}</div>
              ) : null}
            </div>
            <br />
            <div>
              <label htmlFor="role" className="editLabel">
                {language === "hindi" ? "Role" : "भूमिका"}

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
                {language === "hindi" ? " Status" : "     स्थिति"}
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
                {language === "hindi" ? " Edit User" : " यूजर को संपादित करो"}
              </button>
            </div>
          </form>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default EditAdmin;
