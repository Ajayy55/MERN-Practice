import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { usePermissions } from "../../context/PermissionsContext";
import axios from "axios";
import { PORT } from "../../port/Port";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../utils/Alert";
import BackButton from "../utils/BackButton";
import SimpleTabs from "../utils/SimpleTabs";

function AddSocietyUser() {
  
  const {errorAlert} =useAlert();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const id = location.state;
  const navigate = useNavigate();
  const [rolesData, setRolesData] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const paginatedEntries=[];
  const [usersData,setUsersData]=useState([])

  const customButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 11px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "inline-block",
    textAlign: "center",
    width: "95%",
  };

  const fetchSocietyUser=async(req,res)=>{
    try {
      const url=`${PORT}getUsersBySocietyId/${id}`;
      const response=await axios.get(url);
      // console.log(response);
      if(response.status==200){
        setUsersData(response?.data?.response);
      }
      
    } catch (error) {
      console.log(error); 
    }
  }

  useEffect(() => {
    const fetchRolesList = async () => {
      try {
        const admin = localStorage.getItem("user");
        const url = `${PORT}getUserRoles/${admin}`;
        const response = await axios.get(url);
        // console.log(response);
        
        if (response.status === 200) {

          if(response.data.response.length<=0){
            console.log(response.data.response);
            errorAlert('You dont have Roles')
          }
          setRolesData(response.data.response);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRolesList();
    fetchSocietyUser();
  }, []);
//  console.log(usersData);
 
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      role: "",
      isActive: true,
      rwaImage: null,
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
      rwaImage: Yup.mixed()
        .nullable()
        .required("RWA image is required")
        .test(
          "fileType",
          "Unsupported file format. Only images are allowed.",
          (value) =>
            !value ||
            (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
        ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("createdBy", localStorage.getItem("user"));
      formData.append("society",id);
      formData.append("permissionLevel", rolesData.find((role) => role._id === values.role)?.permissionLevel || "");
      Object.keys(values).forEach((key) => {
        if (key !== "rwaImage") formData.append(key, values[key]);
      });
      if (values.rwaImage) formData.append("rwaImage", values.rwaImage);

      try {
        const url = `${PORT}register`;
        const response = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response?.data.message || "User Added!",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchSocietyUser();
          // setTimeout(() => navigate("/society"), 1000);
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error?.response?.data.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(`${PORT}removeUser/${id}`).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "User removed successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchSocietyUser();
            }
          });
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    });
  };
  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
         
            <div> <BackButton/></div>
            {hasPermission("Society List", "Create") && (
              <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className="card p-4">
                  <h3 className="card-title text-center">Add {usersData[0]?.society ? usersData[0]?.society?.name : ""} Admin User</h3>
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
                      {formik.touched.name && formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="mobile" className="form-label">
                        Mobile Number<span className="text-danger">*</span>
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
                      {formik.touched.mobile && formik.errors.mobile && (
                        <div className="text-danger">{formik.errors.mobile}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="email" className="form-label">
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="text-danger">{formik.errors.email}</div>
                      )}
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
                      {formik.touched.password && formik.errors.password && (
                        <div className="text-danger">{formik.errors.password}</div>
                      )}
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
                        {rolesData.map((role) => (
                          <option value={role._id} key={role._id}>
                            {role.title}
                          </option>
                        ))}
                      </select>
                      {formik.touched.role && formik.errors.role && (
                        <div className="text-danger">{formik.errors.role}</div>
                      )}
                    </div>

                    {/* RWA Image */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="rwaImage" className="form-label">
                        RWA Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="rwaImage"
                        name="rwaImage"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("rwaImage", file);
                          setSelectedFileName(file ? file.name : "");
                        }}
                      />
                      <label htmlFor="rwaImage" style={customButtonStyle}>
                        Choose File
                      </label>
                      {selectedFileName && <p>{selectedFileName}</p>}
                      {formik.touched.rwaImage && formik.errors.rwaImage && (
                        <div className="text-danger">{formik.errors.rwaImage}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    style={{ width: "50%", margin: "0 auto", display: "block" }}
                  >
                    Add Society User
                  </button>
                </div>
              </form>
            )}
          </div>
          </div>
          <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
          <div className="table-responsive">
          <div className="d-flex justify-content-center">
          
          <span className="text-center fs-4 fw-bold text-capitalize">{usersData[0]?.society ? usersData[0]?.society?.name+'( '+usersData[0]?.society?.city +' )': 'Society'} User's List</span>
        </div>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.length > 0 && usersData.map((user) => {
                       return <tr key={user._id}>
                          <td className="py-1 text-capitalize">
                            <img
                              src="../../assets/images/faces-clipart/pic-1.png"
                              alt="user avatar"
                              className="me-2"
                            />
                            {user.name}
                          </td>
                          <td>{user.email}</td>
                          <td>
                            {user.isActive ? (
                              <div className="badge badge-outline-success">Active</div>
                            ) : (
                              <div className="badge badge-outline-danger">Inactive</div>
                            )}
                          </td>
                          <td className="text-capitalize">{user.role?.title}</td>
                          <td>
                            <div>
                              {/* {hasPermission("Users", "Edit") && (
                                <i
                                  className="mdi mdi-lead-pencil pe-3"
                                  data-bs-toggle="tooltip"
                                  title="Edit"
                                  onClick={() => handleEdit(user._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )} */}
                              {hasPermission("Users", "Delete") && (
                                <i
                                  className="mdi mdi-delete"
                                  data-bs-toggle="tooltip"
                                  title="Delete"
                                  onClick={() => handleDelete(user._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      })}
                      {paginatedEntries.length === 0 && usersData.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddSocietyUser;
