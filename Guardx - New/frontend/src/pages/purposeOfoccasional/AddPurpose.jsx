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

function AddPurpose() {
  const { errorAlert } = useAlert();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const id = location.state;
  const navigate = useNavigate();
  const [occasionalEntries, setOccasionalEntries] = useState([]);
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
    purposeIcon: Yup.mixed()
      .required("Icon is required")
      .test("fileSize", "File size is too large", (value) => {
        return value && value.size <= 2000000; // 2MB max file size
      })
      .test("fileType", "Only image files are allowed", (value) => {
        return value && ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
    PurposeType: Yup.string().required("Please select purpose type"),
  });

 

  const formik = useFormik({
    initialValues: {
      name: "",
      purposeIcon: null,
      PurposeType: "", // Initialize PurposeType as empty string
    },
    validationSchema, // Pass the validation schema
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values);
      
      const formData = new FormData();
      formData.append("purpose", values.name);
      formData.append("createdBy", localStorage.getItem('user'));
      formData.append("purposeIcon", values.purposeIcon);
      formData.append("purposeType", values.PurposeType);

      try {
        // Assuming you're sending the data to an endpoint for submission
        const response = await axios.post(`${PORT}addPurpose`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        if (response.status === 201) {
          Swal.fire("Success", "Entry added successfully!", "success");
          navigate("/purposeOfOccasional");  // Redirect after successful submission
        } else {
          Swal.fire("Error", "There was an issue adding the entry.", "error");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire("Error", "An error occurred while submitting the form.", "error");
      }
    },
  });

  const fetchTypesOfEntries = async () => {
    try {
      
      const user=localStorage.getItem('user')
      const url = `${PORT}getTypeOfEntriesByCreatedBy`;
      const response = await axios.get(url);
      // console.log('rr',response);
      
      if (response) {
        const entries = response?.data?.response;
        const occasional=entries.filter((entry)=>entry.entryType==="occasional")
        // console.log('emnt',occasional);
        
        setOccasionalEntries(occasional);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTypesOfEntries()
   }, []);


  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
          <div> <BackButton/></div>
            {hasPermission("Type of Entries", "Create") && (
              <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className="card p-5" >
                  <h3 className="card-title mb-3">Add Purpose of Occasional Visits</h3>
                  <div className="row ">
                    {/* Entry Title */}
                    <div className="col-md-5 mb-2" >
                      <label htmlFor="name" className="form-label">
                        Add Purpose Title<span className="text-danger">*</span>
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
                      <label htmlFor="purposeIcon" className="form-label">
                        Select Icon<span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="purposeIcon"
                        name="purposeIcon"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("purposeIcon", file);
                          setSelectedFileName(file ? file.name : "");
                        }}
                      />
                      <label htmlFor="purposeIcon" style={customButtonStyle}>
                        Choose File
                      </label>
                      {selectedFileName && <p>{selectedFileName}</p>}
                      {formik.touched.purposeIcon && formik.errors.purposeIcon && (
                        <div className="text-danger">{formik.errors.purposeIcon}</div>
                      )}
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    {/* Entry Type */}
                    <div className="col-md-5 mb-4">
                      <label htmlFor="PurposeType" className="form-label">
                        Select Type of Purpose<span className="text-danger">*</span>
                      </label>
                      <div>
                        <select
                          className="form-control"
                          id="regular"
                          name="PurposeType"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                            <option label="Choose Purpose Type"></option>
                                {   
                                    occasionalEntries?.map((entry)=>{
                                       return <option key={entry._id} className="text-capitalize">{entry?.title}</option>
                                    })
                                } 
                            </select>
                       
                      </div>
                      {formik.touched.PurposeType && formik.errors.PurposeType && (
                        <div className="text-danger">{formik.errors.PurposeType}</div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5 mb-8">
                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    // style={{ width: "50%", margin: "0 auto", display: "block" }}
                  >
                    Add Purpose
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



export default AddPurpose
