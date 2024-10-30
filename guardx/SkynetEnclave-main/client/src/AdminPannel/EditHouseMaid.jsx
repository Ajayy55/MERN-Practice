import React, { useEffect, useState } from "react";
import axios from "axios";
import { PORT } from "../Api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./form.css";

import { useNavigate, useParams } from "react-router-dom";
import ShowRegularImages from "./ShowRegularImages";
import Swal from "sweetalert2";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
import { useContext } from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function EditHouseMaid() {
  const { language } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const paramsId = useParams();
  const id = paramsId.id;
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      houseMaidEnglish: "",
      gender: "",
      address: "",
      aadharNumber: "",
    },
    validationSchema: Yup.object({
      houseMaidEnglish: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      aadharNumber: Yup.string().required("Aadhaar no. is required"),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to update the entry.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`${PORT}/updateHouseMaidData/${id}`, {
              houseMaidEnglish: values.houseMaidEnglish,
              gender: values.gender,
              address: values.address,
              aadharNumber: values.aadharNumber,
            });

            Swal.fire({
              title: "Updated!",
              text: "Your entry has been updated.",
              icon: "success",
              className:"show-top"
            }).then(() => {
              navigate(-1);
            });
          } catch (error) {
            console.error("Error updating entry:", error);

            Swal.fire({
              title: "Error",
              text: "An error occurred while updating the entry.",
              icon: "error",
            });
          }
        }
      });
    },
  });

  const [getEditData, setGetEditData] = useState([]);
  console.log("getEditData", getEditData);

  useEffect(() => {
    const getEntryData = async () => {
      try {
        const response = await axios.get(`${PORT}/updateHouseMaid/${id}`);
        if (response.data.data) {
          setGetEditData(response.data.data);
          formik.setValues(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching entry data:", error);
      }
    };
    getEntryData();
  }, [id]);

  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi"
              ? "Edit Regular Entries"
              : "नियमित प्रविष्टियाँ संपादित करें"}
          </h5>

          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="add_regular_div">
          <form onSubmit={formik.handleSubmit} className="house_maid_form">
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="houseMaidEnglish">
                {language === "hindi" ? "Name" : "नाम"}
              </label>
              <br />
              <input
                type="text"
                id="houseMaidEnglish"
                name="houseMaidEnglish"
                value={formik.values.houseMaidEnglish}
                onChange={formik.handleChange}
                className="edit-input-regular"
              />
              {formik.errors.houseMaidEnglish && (
                <div className="error">{formik.errors.houseMaidEnglish}</div>
              )}
            </div>
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="address">
                {language === "hindi" ? " Address" : "पता"}
              </label>
              <br />
              <input
                type="text"
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                className="edit-input-regular"
              />
              {formik.errors.address && (
                <div className="error">{formik.errors.address}</div>
              )}
            </div>
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="aadharNumber">
                {language === "hindi" ? "Aadhaar Number" : "  आधार नंबर"}
              </label>
              <br />
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formik.values.aadharNumber}
                onChange={formik.handleChange}
                className="edit-input-regular"
              />
              {formik.errors.aadharNumber && (
                <div className="error">{formik.errors.aadharNumber}</div>
              )}
            </div>
            <div className="edit-input-regular-main-input-div">
              <div>
                <label className="editLabel">
                  {language === "hindi" ? "Gender" : "लिंग"}
                </label>
                <br />
                <label className="label_input_radio">
                  <input
                    type="radio"
                    id="genderMale"
                    name="gender"
                    value="Male"
                    checked={formik.values.gender === "Male"}
                    onChange={formik.handleChange}
                  />{" "}
                  {language === "hindi" ? "Male" : "पुरुष"}
                </label>
                <label className="label_input_radio">
                  <input
                    type="radio"
                    id="genderFemale"
                    name="gender"
                    value="Female"
                    checked={formik.values.gender === "Female"}
                    onChange={formik.handleChange}
                  />{" "}
                  {language === "hindi" ? " Female" : "महिला"}
                </label>
              </div>
            </div>
            <br />
            {formik.errors.gender && (
              <div className="error">{formik.errors.gender}</div>
            )}
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel-regular-modal-images" htmlFor="image">
                {language === "hindi"
                  ? "Edit User Image"
                  : " उपयोगकर्ता छवि संपादित करें"}
              </label>
              {/* <br /> */}
              <ShowRegularImages
                data={getEditData && getEditData}
                view={"image"}
              />
            </div>
            <br />
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel-regular-modal-images" htmlFor="aadharImage">
                {language === "hindi"
                  ? "  Edit Aadhaar Image"
                  : "आधार छवि संपादित करें"}
              </label>
              {/* <br /> */}
              <ShowRegularImages
                data={getEditData && getEditData}
                view={"aadharImage"}
              />
            </div>
            <br />
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel-regular-modal-images" htmlFor="optionalImage">
                {language === "hindi"
                  ? " Edit Other Documents"
                  : "अन्य दस्तावेज़ संपादित करें"}
              </label>
              {/* <br /> */}
              <ShowRegularImages
                data={getEditData && getEditData}
                view={"optionalImage"}
              />
            </div>

            <button className="edit-button">
              {language === "hindi" ? "Update" : "अद्यतन"}
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default EditHouseMaid;
