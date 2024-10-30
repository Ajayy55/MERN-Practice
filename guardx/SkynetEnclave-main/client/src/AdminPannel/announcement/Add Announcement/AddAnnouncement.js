import React, { useEffect, useState, useRef, useContext } from "react";
import Layout from "../../../lib/Layout";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { PORT } from "../../../Api/api";
import Swal from "sweetalert2";
import AddBackbtn from "../../../lib/AddBackbtn";
import { LanguageContext } from "../../../lib/LanguageContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer ,toast} from "react-toastify";
const AddAnnouncement = () => {
  const { language } = useContext(LanguageContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const default_level = JSON.parse(localStorage.getItem("role"));
  const society_id = JSON.parse(localStorage.getItem("society_id"));
  const roleId = JSON.parse(localStorage.getItem("roleId"));
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array()
      .min(1, "At least one image is required")
      .required("Images are required"),
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      images: [],
      category: "",
      createdBy: roleId,
      society_id: society_id || null,
      defaultPermissionLevel: default_level,
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Are you sure you want to add this Announcement?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          Object.keys(values).forEach((key) => {
            if (key !== "images") {
              formData.append(key, values[key]);
            }
          });
          values.images.forEach((image) => {
            formData.append("images", image);
          });
          const response = await axios.post(`${PORT}addAnnouncement`, formData);
          toast(response.data.msg);
          formik.resetForm();
          setTimeout(() => {
            navigate("/admin/viewAnnouncement");
          }, 1000);
        } catch (error) {
          console.error("Error", error.response?.data?.error);
        }
      } else {
        toast.error("Your Entry is not Added");
      }
    },
  });

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (imageFiles.length > 0) {
        formik.setFieldValue("images", imageFiles);
      } else {
        toast.error("Please upload image files");
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Layout>
     
      <div className="table_heading">
        <h5 className="heading_top">Add Announcement</h5>
        <div className="hrline"></div>
      </div>
      <AddBackbtn />
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-margin_top">
            <div className="add-announcement-main-div">
              <form onSubmit={formik.handleSubmit}>
                <div className="add-announcement-form-div">
                  <div className="view-announcement-edit-input-div">
                    <label className="editLabel" htmlFor="title">
                      {language === "hindi" ? "Title" : " शीर्षक"}
                      <span className="Star_color">*</span>
                    </label>
                 
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      className="edit-input"
                      maxLength={30}
                    />
                    {formik.errors.title && formik.touched.title && (
                      <div className="view-announcement-errors-msg">{formik.errors.title}</div>
                    )}
                  </div>
                  <div className="view-announcement-edit-input-div">
                    <label className="editLabel" htmlFor="description">
                      {language === "hindi" ? " Description" : "विवरण "}
                      <span className="Star_color">*</span>
                    </label>
             
                    <textarea 
                      id="description"
                      name="description"
                      onChange={formik.handleChange}
                      className="edit-input"
                      value={formik.values.description}
                    />
                    {formik.errors.description &&
                      formik.touched.description && (
                        <div className="view-announcement-errors-msg">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>
                  <div className="view-announcement-edit-input-div">
                    <label className="editLabel" htmlFor="images">
                      {language === "hindi" ? "Images" : "इमेजेस "}
                      <span className="Star_color">*</span>
                    </label>
                  
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="edit-input"
                      ref={fileInputRef}
                    />
                    {formik.errors.images && formik.touched.images && (
                      <div className="view-announcement-errors-msg">{formik.errors.images}</div>
                    )}
                  </div>
                  <div className="view-announcement-edit-input-div">
                    <label className="editLabel" htmlFor="category">
                      {language === "hindi" ? "Category" : " श्रेणी"}
                      <span className="Star_color">*</span>
                    </label>
                 
                    <select
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      className="edit-input"
                    >
                      <option value="" label="Select category" />
                      <option value="Security" label="Security" />
                      <option value="Event" label="Event" />
                      <option value="Maintenance" label="Maintenance" />
                      <option value="News" label="News" />
                      <option value="Power Supply" label="Power Supply" />
                      <option value="Other" label="Other" />
                    </select>
                    {formik.errors.category && formik.touched.category && (
                      <div className="view-announcement-errors-msg">{formik.errors.category}</div>
                    )}
                  </div>
                </div>
                <div className="main_button_div">
                  <button className="edit-button" type="submit">
                    {language === "hindi" ? "Add Announcement" : "घोषणा जोड़ें"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    
    </Layout>
  );
};

export default AddAnnouncement;
