import React, { useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import AdminNavbar from "./AdminNavbar";
import { PORT } from "../Api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./nav.css";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
import { useFormikContext } from "formik";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const getValidationMessage = (language, englishMessage, hindiMessage) => {
  return language === "english" ? hindiMessage : englishMessage;
};
const AddSociety = () => {
  const { language } = useContext(LanguageContext);
  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (
          key === "secretaryPhoto" ||
          key === "secretaryDetails" ||
          key === "societyImages" ||
          key === "superAdminDocument" ||
          key === "superAdminPhoto"
        ) {
          Array.from(values[key]).forEach((file) => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await axios.post(`${PORT}/addSociety`, formData);

      console.log(response, "New Society Added");
      actions.setSubmitting(false);
      toast.success("Society Added Successfully!");
      setTimeout(() => {
        navigate("/admin/society-details");
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const initialValues = {
    name: "",
    address: "",
    defaultPermissionLevel: 4,
    societyContactNumber: "",
    role: "Society Admin",
    createdBy: getRoleId,
    state:"",
    city:""
  };

  const navigate = useNavigate();
  const useRevalidateOnLanguageChange = () => {
    const { validateForm } = useFormikContext();

    React.useEffect(() => {
      validateForm();
    }, [language, validateForm]);
  };
  const RevalidateOnLanguageChange = () => {
    useRevalidateOnLanguageChange();
    return null;
  };
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? " Add Society" : "सोसायटी जोड़ें"}
          </h5>

          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <br />
        <div className="society_form_div">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting, setFieldValue }) => (
              <Form enctype="multipart/form-data">
                <div className="society_main">
                  <div className="society_main_div">
                    <div className="society_detail_heading">
                      {language === "hindi"
                        ? " Society details"
                        : "सोसायटी विवरण"}
                    </div>
                    <div>
                      <label className="edit_society_lable" htmlFor="name">
                        {language === "hindi"
                          ? "  Society Name "
                          : "सोसायटी का नाम "}
                        <span className="Star_color">*</span>
                      </label>
                      <br />
                      <Field
                        type="text"
                        id="name"
                        className="edit-input"
                        name="name"
                        required
                        maxLength="35"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="error_msg_society"
                      />
                    </div>
                    <div>
                      <label
                        className="edit_society_lable"
                        htmlFor="societyLogo"
                      >
                        {language === "hindi"
                          ? "    Society Logo "
                          : "सोसायटी लोगो  "}
                        {/* <span className="Star_color">*</span> */}
                      </label>
                      <br />
                      <input
                        type="file"
                        className="edit-input"
                        // id="societyLogo"
                        name="societyLogo"
                        accept="image/*"
                        onChange={(event) => {
                          setFieldValue(
                            "societyLogo",
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                      <ErrorMessage
                        name="societyLogo"
                        component="div"
                        className="error_msg_society"
                      />
                    </div>
                    {/* Address */}
                    <div>
                      <label className="edit_society_lable" htmlFor="address">
                        {language === "hindi" ? " Address" : "पता"}
                        <span className="Star_color">*</span>
                      </label>
                      <br />
                      <Field
                        type="text"
                        className="edit-input"
                        id="address"
                        name="address"
                        maxLength="45"
                        required
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="error_msg_society"
                      />
                    </div>
                    {/* State */}
                    <div>
                      <label className="edit_society_lable" htmlFor="state">
                        {language === "hindi" ? " State" : "राज्य"}
                        <span className="Star_color">*</span>
                      </label>
                      <br />
                      <Field
                        type="text"
                        className="edit-input"
                        id="state"
                        name="state"
                        maxLength="45"
                        required
                      />
                    </div>
                    {/* City */}
                    <div>
                      <label className="edit_society_lable" htmlFor="city">
                        {language === "hindi" ? " City" : "शहर"}
                        <span className="Star_color">*</span>
                      </label>
                      <br />
                      <Field
                        type="text"
                        className="edit-input"
                        id="city"
                        name="city"
                        maxLength="45"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="edit_society_lable"
                        htmlFor="societyContactNumber"
                      >
                        {language === "hindi"
                          ? "  Contact No."
                          : "संपर्क संख्या"}
                        <span className="Star_color">*</span>
                      </label>
                      <br />
                      <Field
                        type="text"
                        className="edit-input"
                        id="societyContactNumber"
                        name="societyContactNumber"
                        required
                        pattern="\d{10}" // pattern to allow exactly 10 digits
                        title="Please enter exactly 10 digits."
                      />
                      <ErrorMessage
                        name="societyContactNumber"
                        component="div"
                        className="error_msg_society"
                      />
                    </div>

                    <div>
                      <label
                        className="edit_society_lable"
                        htmlFor="societyHouseList"
                      >
                        {language === "hindi"
                          ? "No.of Houses in Society"
                          : "सोसायटी  में घरों की संख्या "}{" "}
                      </label>
                      <br />
                      <Field
                        type="number"
                        className="edit-input"
                        id="societyHouseList"
                        name="societyHouseList"
                       
                      />
                      <ErrorMessage
                        name="societyHouseList"
                        component="div"
                        className="error_msg_society"
                      />
                    </div>
                    <div>
                      <label
                        className="edit_society_lable"
                        htmlFor="societyRegistration"
                      >
                        {language === "hindi"
                          ? "Society Registration No."
                          : "सोसायटी पंजीकरण संख्या "}{" "}
                        {/* <span className="Star_color">*</span> */}
                      </label>
                      <br />
                      <Field
                        type="text"
                        className="edit-input"
                        id="societyRegistration"
                        name="societyRegistration"
                        maxLength="45"
                      />
                      <ErrorMessage
                        name="societyRegistration"
                        component="div"
                        className="error_msg_society"
                      />
                    </div>
                  </div>

                  <div className="society_bottom_btn_div">
                    <button
                      className="society_btn"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {language === "hindi" ? "    Submit" : "  जमा करना"}
                    </button>
                    <RevalidateOnLanguageChange />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default AddSociety;
