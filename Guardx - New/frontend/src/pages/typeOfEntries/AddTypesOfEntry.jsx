import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";  // Import Yup for validation
import { usePermissions } from "../../context/PermissionsContext";
import axios from "axios";
import { PORT } from "../../port/Port";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../utils/Alert";
import BackButton from "../utils/BackButton";

function AddTypesOfEntry() {
  const { errorAlert } = useAlert();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const id = location.state;
  const navigate = useNavigate();
  const [rolesData, setRolesData] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");

  const customButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 11px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "inline-block",
    textAlign: "center",
    width: "100%",
  };

  // Formik validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Entry Title is required")
      .min(3, "Entry Title must be at least 3 characters"),
    entryIcon: Yup.mixed()
      .required("Icon is required")
      .test("fileSize", "File size is too large", (value) => {
        return value && value.size <= 2000000; // 2MB max file size
      })
      .test("fileType", "Only image files are allowed", (value) => {
        return value && ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
    entryType: Yup.string().required("Please select an entry type"),
  });

 

  const formik = useFormik({
    initialValues: {
      name: "",
      entryIcon: null,
      entryType: "", // Initialize entryType as empty string
    },
    validationSchema, // Pass the validation schema
    onSubmit: async (values) => {
      // Handle form submission
      // console.log(values);
      
      const formData = new FormData();
      formData.append("title", values.name);
      formData.append("createdBy", localStorage.getItem('user'));
      formData.append("entryIcon", values.entryIcon);
      formData.append("entryType", values.entryType);

      try {
        // Assuming you're sending the data to an endpoint for submission
        const response = await axios.post(`${PORT}addTypeOfEntry`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log('rr',response);
        
        if (response.status === 201) {
          Swal.fire("Success", "Entry added successfully!", "success");
          navigate("/TypeOfEntries");  // Redirect after successful submission
        } else {
          Swal.fire("Error", "There was an issue adding the entry.", "error");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire("Error", "An error occurred while submitting the form.", "error");
      }
    },
  });

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
          <div> <BackButton/></div>
            {hasPermission("Type of Entries", "Create") && (
              <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className="card p-5" >
                  <h3 className="card-title mb-3">Add Types of Entries</h3>
                  <div className="row ">
                    {/* Entry Title */}
                    <div className="col-md-5 mb-2" >
                      <label htmlFor="name" className="form-label">
                        Add Entry Title<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter Entry Title"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    {/* Icon Selection */}
                    <div className="col-md-5 mb-2">
                      <label htmlFor="entryIcon" className="form-label">
                        Select Icon
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="entryIcon"
                        name="entryIcon"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("entryIcon", file);
                          setSelectedFileName(file ? file.name : "");
                        }}
                      />
                      <label htmlFor="entryIcon" style={customButtonStyle}>
                        Choose File
                      </label>
                      {selectedFileName && <p>{selectedFileName}</p>}
                      {formik.touched.entryIcon && formik.errors.entryIcon && (
                        <div className="text-danger">{formik.errors.entryIcon}</div>
                      )}
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    {/* Entry Type */}
                    <div className="col-md-4 mb-4">
                      <label htmlFor="entryType" className="form-label">
                        Select Type of Entry
                      </label>
                      <div>
                        <input
                          type="radio"
                          id="regular"
                          name="entryType"
                          value="regular"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label htmlFor="regular" className="form-label me-3">
                          Regular
                        </label>

                        <input
                          type="radio"
                          id="occasional"
                          name="entryType"
                          value="occasional"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label htmlFor="occasional" className="form-label">
                          Occasional<span className="text-danger">*</span>
                        </label>
                      </div>
                      {formik.touched.entryType && formik.errors.entryType && (
                        <div className="text-danger">{formik.errors.entryType}</div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8 mb-8">
                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    // style={{ width: "50%", margin: "0 auto", display: "block" }}
                  >
                    Add Entry
                  </button>
                  </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddTypesOfEntry;
