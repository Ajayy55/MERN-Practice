import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PORT } from "../Api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./form.css";
import AdminNavbar from "./AdminNavbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoMdArrowBack } from "react-icons/io";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
import { IoEyeSharp } from "react-icons/io5";
import EditHouseModal from "./EditHouseModalView/EditHOuseView/EditHouseModal";
import ShowEditEntryImage from "./ShowEditEntryImage";
import EditHouseImageModal from "./EditHouseImageModalView/EditHouseImageModal";
import { toast, ToastContainer } from "react-toastify";

const EditHouseData = () => {
  const { language } = useContext(LanguageContext);
  const [details, setDetails] = useState(null);
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    houseNo: Yup.string().required("House number is required"),
    blockNumber: Yup.string().required("Block number is required")
    // username: Yup.string().required("Username is required"),
    // password: Yup.string().required("Password is required"),
    // isRwaMember: Yup.string().required("Rwa member is required"),
  });
  const [file, setFile] = useState(null);
  const formik = useFormik({
    initialValues: {
      houseNo: "",
      ownerName: "",
      userPhoneNo: "",
      aadhaarNumber: "",
      blockNumber: "",
      ownerImages: "",
      username: "",
      password: "",
      isRwaMember: "no",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await Swal.fire({
          title: "Do you want to update this house details?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (result.isConfirmed) {
          // Prepare the form data
          const formData = new FormData();
          formData.append("houseNo", values.houseNo? values.houseNo:"");
          formData.append("ownerName", values.ownerName?values.ownerName:"");
          formData.append("userPhoneNo", values.userPhoneNo?values.userPhoneNo:"");
          formData.append("aadhaarNumber", values.aadhaarNumber?values.aadhaarNumber:"");
          formData.append("blockNumber", values.blockNumber? values.blockNumber:"");
          formData.append("username", values.username?values.username:"");
          formData.append("password", values.password? values.password:"");
          formData.append("isRwaMember", values.isRwaMember?values.isRwaMember:"");
          if (file) {
            formData.append("ownerImages", file);
          }
          const res = await axios.put(
            `${PORT}/houseDetailsUpdate/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          localStorage.removeItem("houseId");
          navigate("/admin/house-data");
        }
      } catch (error) {
        console.error("Error updating entry:", error);
        toast.error(error.response.data.msg)
      }
    },
  });
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${PORT}/houseDetailsUpdate/${id}`);
        formik.setValues(response.data.details);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetails();
  }, [id]);

  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi"
              ? "Edit House Details"
              : "घर का विवरण संपादित करें"}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="house_form_div ">
          <div className="add-house-main-div">
            <form onSubmit={formik.handleSubmit}>
              <div className="edit-house-form-div">
                <div>
                  <label className="editLabel" htmlFor="houseNo">
                    {language === "hindi" ? "House No." : "मकान नंबर"}{" "}
                    <span className="Star_color">*</span>
                  </label>
                  <br />
                  <input
                    type="text"
                    id="houseNo"
                    name="houseNo"
                    value={formik.values.houseNo}
                    onChange={formik.handleChange}
                    className="edit-input"
                    maxLength="30"
                  />
                  {formik.errors.houseNo && (
                    <div className="error-house">{formik.errors.houseNo}</div>
                  )}
                </div>
                <div>
                  <label className="editLabel" htmlFor="blockNumber">
                    {language === "hindi" ? "Block No." : "ब्लॉक नं"}{" "}
                    <span className="Star_color">*</span>
                  </label>
                  <br />
                  <input
                    type="text"
                    id="blockNumber"
                    name="blockNumber"
                    value={formik.values.blockNumber}
                    onChange={formik.handleChange}
                    className="edit-input"
                    maxLength="40"
                  />
                  {formik.errors.blockNumber && (
                    <div className="error-house">
                      {formik.errors.blockNumber}
                    </div>
                  )}
                </div>
                <div>
                  <label className="editLabel" htmlFor="ownerName">
                    {language === "hindi" ? "  Owner Name" : "मालिक का नाम"}
                  </label>
                  <br />
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formik.values.ownerName}
                    onChange={formik.handleChange}
                    autoComplete="off"
                    className="edit-input"
                  />
                </div>

                <div>
                  <label className="editLabel" htmlFor="userPhoneNo">
                    {language === "hindi" ? "  Contact No." : "संपर्क नंबर"}
                  </label>
                  <br />
                  <input
                    type="text"
                    id="userPhoneNo"
                    name="userPhoneNo"
                    value={formik.values.userPhoneNo}
                    onChange={formik.handleChange}
                    className="edit-input"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="editLabel" htmlFor="adhaarNo">
                    {language === "hindi" ? "Aadhaar No." : "आधार नं"}
                  </label>
                  <br />
                  <input
                    type="text"
                    id="adhaarNo"
                    name="aadhaarNumber"
                    value={formik.values.aadhaarNumber}
                    onChange={formik.handleChange}
                    className="edit-input"
                    maxLength="12"
                  />
                  {formik.errors.aadhaarNumber && (
                    <div className="error-house">
                      {formik.errors.aadhaarNumber}
                    </div>
                  )}
                </div>
                <div>
                  <label className="editLabel" htmlFor="ownerImages">
                    {language === "hindi" ? "Owner Image" : "मालिक की तस्वीर"}
                  </label>
                  <br />
                  <div className="edit-house-owner-images">
                    <input
                      type="file"
                      id="ownerImages"
                      name="ownerImages"
                      className="edit-input"
                      maxLength="12"
                      onChange={(event) =>
                        setFile(event.currentTarget.files[0])
                      }
                    />
                    <span className="icon">
                      <EditHouseImageModal
                        data={formik.values.ownerImages}
                        item={formik.values.houseNo}
                      />
                    </span>
                  </div>
                </div>
                <div>
                  <label className="editLabel" htmlFor="username">
                    {language === "hindi" ? "Email Address" : "ईमेल पता"}{" "}
                    {/* <span className="Star_color">*</span> */}
                  </label>
                  <br />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className="edit-input"
                    maxLength="40"
                  />
                  {/* {formik.errors.username && (
                    <div className="error-house">{formik.errors.username}</div>
                  )} */}
                </div>
                <div>
                  <label className="editLabel" htmlFor="password">
                    {language === "hindi" ? "Password" : "पासवर्ड दर्ज करें"}{" "}
                    {/* <span className="Star_color">*</span> */}
                  </label>
                  <br />
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className="edit-input"
                    maxLength="40"
                  />
                  {/* {formik.errors.password && (
                    <div className="error-house">{formik.errors.password}</div>
                  )} */}
                </div>
                <div className="edit-house-owner-isRwaMember">
                  <div>
                    <label className="editLabel" htmlFor="blockNumber">
                      {language === "english"
                        ? "RWA सदस्य हैं?"
                        : "Is this an RWA member?"}
                      {/* <span className="Star_color">*</span> */}
                    </label>
                    <br />
                    <div className="edit-house-owner-isRwaMember-radio-div">
                      <label className="edit-house-owner-isRwaMember-radio">
                        <input
                          type="radio"
                          id="isRwaMemberYes"
                          name="isRwaMember"
                          value="yes"
                          checked={formik.values.isRwaMember === "yes"} // Use formik values
                          onChange={formik.handleChange}
                        />
                        &nbsp; Yes
                      </label>
                      <label className="edit-house-owner-isRwaMember-radio">
                        <input
                          type="radio"
                          id="isRwaMemberNo"
                          name="isRwaMember"
                          value="no"
                          checked={formik.values.isRwaMember === "no"} // Use formik values
                          onChange={formik.handleChange} // Use formik's handleChange
                        />{" "}
                        &nbsp; No
                      </label>
                    </div>
                    {/* {formik.errors.isRwaMember && (
                      <div className="error-house">
                        {formik.errors.isRwaMember}
                      </div>
                    )} */}
                  </div>
                </div>
                <div className="edit_house_button">
                  <button className="edit-button" type="submit">
                    {language === "hindi" ? "   Update" : "  अद्यतन"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer/>
      </Layout>
    </>
  );
};

export default EditHouseData;
