import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { usePermissions } from "../../context/PermissionsContext";
import axios from "axios";
import { PORT } from "../../port/Port";
import Swal from "sweetalert2";
import { Switch, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackButton from "../utils/BackButton";

function AddUser() {
  const { hasPermission, userRole } = usePermissions();
  const navigate = useNavigate();
  const [rolesData, setRolesData] = useState([]);

  useEffect(() => {
    const fetchRolesList = async () => {
      try {
        const admin = localStorage.getItem("user");
        const url = `${PORT}getUserRoles/${admin}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          setRolesData(response.data.response);
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    fetchRolesList();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      role: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Username is required"),
      mobile: Yup.string()
        .matches(/^[0-9]+$/, "Mobile number must be only digits")
        .min(10, "Mobile number must be at least 10 digits")
        .max(10, "Mobile number must be only 10 digits")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string().required("Role is required"),
      isActive: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const payload = {
        createdBy: localStorage.getItem("user"),
        permissionLevel: rolesData.find((role) => role._id === values.role)?.permissionLevel,
        ...values,
      };
      console.log(payload);
      
      try {
        const url = `${PORT}register`;
        const response = await axios.post(url, payload);
        
        if (response.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response?.data.message || "User Added !",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/users");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        
        Swal.fire({
          position: "center",
          icon: "error",
          title: error?.response?.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
          <div> <BackButton/></div>
            {hasPermission("Roles", "Create") && (
              <form onSubmit={formik.handleSubmit}>
                <div className="card p-4">
                  <h3 className="card-title text-center">Add User Details</h3>
                  <div className="row">
                    {/* Username */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="name" className="form-label">
                        Username<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter Username"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <div className="text-danger">{formik.errors.name}</div>
                      ) : null}
                    </div>

                    {/* Mobile */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="mobile" className="form-label">
                        Mobile number<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="mobile"
                        name="mobile"
                        placeholder="Enter Mobile No."
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.mobile && formik.errors.mobile ? (
                        <div className="text-danger">{formik.errors.mobile}</div>
                      ) : null}
                    </div>

                    {/* Email */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="email" className="form-label">
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="row">
                    {/* Password */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="password" className="form-label">
                        Password<span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                      ) : null}
                    </div>

                    {/* Role */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="role" className="form-label">
                        Select Role<span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" label="Select role" />
                        {rolesData.length > 0 &&
                          rolesData.map((role) => (
                            <option value={role._id} key={role._id}>
                              {role.title}
                            </option>
                          ))}
                      </select>
                      {formik.touched.role && formik.errors.role ? (
                        <div className="text-danger">{formik.errors.role}</div>
                      ) : null}
                    </div>

                    {/* Status */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="isActive" className="form-label">
                        Status<span className="text-danger">*</span>
                      </label>
                      <br />
                      <FormControlLabel
                        control={
                          <Switch
                            id="isActive"
                            name="isActive"
                            checked={formik.values.isActive}
                            onChange={(event) =>
                              formik.setFieldValue("isActive", event.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={formik.values.isActive ? "Active" : "Inactive"}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary mt-3" style={{ width: "50%", marginLeft: "20%" }}>
                    Add User
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddUser;
