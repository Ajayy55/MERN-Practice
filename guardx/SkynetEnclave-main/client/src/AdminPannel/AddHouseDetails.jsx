import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { PORT } from "../Api/api";
import "./Housedetail.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { LanguageContext } from "../lib/LanguageContext";
const validationSchema = Yup.object({
  houseNo: Yup.string().required("House no. is required"),
  blockNumber: Yup.string().required("Block no. is required"),
});

const AddHouseDetails = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const createdBy = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const initialValues = {
    houseNo: "",
    blockNumber: "",
    createdBy: createdBy,
    society_id: society_id,
    defaultPermissionLevel: "3",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to add this house details",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add it!",
      customClass: {
        container: "my-swal",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(`${PORT}/houseDetails`, values).then((res) => {
        resetForm();
        navigate(-1);
      });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? " Add House Details" : "घर का विवरण जोड़ें"}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="house_outer_main_div">
          <div className="house_form_div">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, setFieldTouched }) => (
                <div className="add-house-main-div">
                  <Form encType="multipart/form-data">
                    <div className="add-house-form-div">
                      <div>
                        <label className="edit_house_lable" htmlFor="houseNo">
                          {language === "hindi" ? " House No. " : "मकान नंबर "}
                          <span className="Star_color">*</span>
                        </label>
                        <br />
                        <Field
                          type="text"
                          id="houseNo"
                          className="edit-input"
                          name="houseNo"
                          required
                          maxLength="30"
                        />
                      </div>
                      <div>
                        <label
                          className="edit_house_lable"
                          htmlFor="blockNumber"
                        >
                          {language === "hindi" ? "Block No." : "ब्लॉक संख्या"}
                          <span className="Star_color">*</span>
                        </label>
                        <br />
                        <Field
                          type="text"
                          id="blockNumber"
                          className="edit-input"
                          name="blockNumber"
                          required
                          maxLength="40"
                        />
                      </div>

                      {/* Submit Button                */}
                      <div className="edit_house_button">
                        <button
                          className="edit-button"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {language === "hindi" ? "  Submit " : "जमा करना"}
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>

        <ToastContainer />
      </Layout>
    </>
  );
};

export default AddHouseDetails;
