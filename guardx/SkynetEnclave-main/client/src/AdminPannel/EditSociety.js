import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PORT } from "../Api/api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./nav.css";
import Layout from "../lib/Layout";
import { IoEyeSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
import { useFormikContext } from "formik";
import EditSocietyImages from "./EditSocietyImages";

const getValidationMessage = (language, englishMessage, hindiMessage) => {
  return language === "english" ? hindiMessage : englishMessage;
};
const EditSociety = () => {
  const { language } = useContext(LanguageContext);
  const params = useParams();
  const id = params.id;
  const [getSocietyDeatils, setGetSoceityDeatils] = useState();
  const getSocietyDataWithId = async () => {
    try {
      const response = await axios.get(`${PORT}/getSocietyDetailsWithId/${id}`);
      console.log(response.data.data);
      setinitialValues(response.data.data);
      setGetSoceityDeatils(response.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getSocietyDataWithId();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      getValidationMessage(language, "Name is required", "नाम आवश्यक है")
    ),
    address: Yup.string().required(
      getValidationMessage(language, "Address is required", "पता आवश्यक है")
    ),
    societyContactNumber: Yup.number()
      .required(
        getValidationMessage(
          language,
          "Contact No. is required",
          "संपर्क नंबर आवश्यक है"
        )
      )
      .typeError(
        getValidationMessage(
          language,
          "Contact No. must be a number",
          "संपर्क नंबर एक संख्या होना चाहिए"
        )
      )
      .min(
        100000000,
        getValidationMessage(
          language,
          "Contact No. must be at least 9 digits",
          "संपर्क नंबर कम से कम 9 अंक का होना चाहिए"
        )
      )
      .max(
        999999999999999,
        getValidationMessage(
          language,
          "Contact No. must be at most 15 digits",
          "संपर्क नंबर अधिकतम 15 अंक का होना चाहिए"
        )
      ),
    alternateNumber: Yup.number()
      .required(
        getValidationMessage(
          language,
          "Alternate No. is required",
          "वैकल्पिक नंबर आवश्यक है"
        )
      )
      .typeError(
        getValidationMessage(
          language,
          "Alternate No. must be a number",
          "वैकल्पिक नंबर एक संख्या होना चाहिए"
        )
      )
      .min(
        100000000,
        getValidationMessage(
          language,
          "Alternate No. must be at least 9 digits",
          "वैकल्पिक नंबर कम से कम 9 अंक का होना चाहिए"
        )
      )
      .max(
        999999999999999,
        getValidationMessage(
          language,
          "Alternate No. must be at most 15 digits",
          "वैकल्पिक नंबर अधिकतम 15 अंक का होना चाहिए"
        )
      ),
    secretaryName: Yup.string().required(
      getValidationMessage(
        language,
        "Society Secretary Name is required",
        "सोसाइटी सचिव का नाम आवश्यक है"
      )
    ),
    secretaryContact: Yup.number()
      .required(
        getValidationMessage(
          language,
          "Society Secretary Contact No. is required",
          "सोसाइटी सचिव संपर्क नंबर आवश्यक है"
        )
      )
      .typeError(
        getValidationMessage(
          language,
          "Society Secretary Contact No. must be a number",
          "सोसाइटी सचिव संपर्क नंबर एक संख्या होना चाहिए"
        )
      )
      .min(
        100000000,
        getValidationMessage(
          language,
          "Society Secretary Contact No. must be at least 9 digits",
          "सोसाइटी सचिव संपर्क नंबर कम से कम 9 अंक का होना चाहिए"
        )
      )
      .max(
        999999999999999,
        getValidationMessage(
          language,
          "Society Secretary Contact No. must be at most 15 digits",
          "सोसाइटी सचिव संपर्क नंबर अधिकतम 15 अंक का होना चाहिए"
        )
      ),
    secretaryPhoto: Yup.array().of(
      Yup.string().required(
        getValidationMessage(
          language,
          "Society Secretary Photo is required",
          "सोसाइटी सचिव का फोटो आवश्यक है"
        )
      )
    ),
    secretaryDetails: Yup.array().of(
      Yup.string().required(
        getValidationMessage(
          language,
          "Society Secretary Documents are required",
          "सोसाइटी सचिव के दस्तावेज़ आवश्यक हैं"
        )
      )
    ),
    ownerName: Yup.string().required(
      getValidationMessage(
        language,
        "Society Owner name is required",
        "सोसाइटी मालिक का नाम आवश्यक है"
      )
    ),
    userPhoneNo: Yup.number()
      .required(
        getValidationMessage(
          language,
          "Owner Contact No. is required",
          "मालिक संपर्क नंबर आवश्यक है"
        )
      )
      .typeError(
        getValidationMessage(
          language,
          "Owner Contact No. must be a number",
          "मालिक संपर्क नंबर एक संख्या होना चाहिए"
        )
      )
      .min(
        100000000,
        getValidationMessage(
          language,
          "Owner Contact No. must be at least 9 digits",
          "मालिक संपर्क नंबर कम से कम 9 अंक का होना चाहिए"
        )
      )
      .max(
        999999999999999,
        getValidationMessage(
          language,
          "Owner Contact No. must be at most 15 digits",
          "मालिक संपर्क नंबर अधिकतम 15 अंक का होना चाहिए"
        )
      ),
    username: Yup.string()
      .required(
        getValidationMessage(language, "Email is required", "ईमेल आवश्यक है")
      )
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        getValidationMessage(
          language,
          "Invalid email format",
          "अमान्य ईमेल प्रारूप"
        )
      ),
    password: Yup.string()
      .min(
        6,
        getValidationMessage(
          language,
          "Password must be at least 6 characters",
          "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"
        )
      )
      .required(
        getValidationMessage(
          language,
          "Password is required",
          "पासवर्ड आवश्यक है"
        )
      ),
    confirmPassword: Yup.string()
      .required(
        getValidationMessage(
          language,
          "Confirm password is required",
          "पासवर्ड की पुष्टि आवश्यक है"
        )
      )
      .oneOf(
        [Yup.ref("password"), null],
        getValidationMessage(
          language,
          "Passwords must match",
          "पासवर्ड मेल खाना चाहिए"
        )
      ),
    societyLogo: Yup.string().required(
      getValidationMessage(
        language,
        "Society logo is required",
        "सोसाइटी लोगो आवश्यक है"
      )
    ),
    societyImages: Yup.array()
      .of(
        Yup.string().required(
          getValidationMessage(
            language,
            "Society Images are required",
            "सोसाइटी छवियाँ आवश्यक हैं"
          )
        )
      )
      .required(
        getValidationMessage(
          language,
          "At least one Society Image is required",
          "कम से कम एक सोसाइटी छवि आवश्यक है"
        )
      ),
    societyRegistration: Yup.string().required(
      getValidationMessage(
        language,
        "Society Registration No. is required",
        "सोसाइटी पंजीकरण नंबर आवश्यक है"
      )
    ),
    societyHouseList: Yup.string().required(
      getValidationMessage(
        language,
        "No. of Houses in Society is required",
        "सोसाइटी में घरों की संख्या आवश्यक है"
      )
    ),
    superAdminPhoto: Yup.array().of(
      Yup.string().required(
        getValidationMessage(
          language,
          " Super Admin Photo Photo is required",
          "सुपर प्रशासक का फोटो आवश्यक है"
        )
      )
    ),
    superAdminContactNo: Yup.number()
      .required(
        getValidationMessage(
          language,
          " Super Admin Contact No. is required",
          "सुपर प्रशासक संपर्क नंबर आवश्यक है"
        )
      )
      .typeError(
        getValidationMessage(
          language,
          "Super Admin Contact No. must be a number",
          "सुपर प्रशासक संपर्क नंबर एक संख्या होना चाहिए"
        )
      )
      .min(
        100000000,
        getValidationMessage(
          language,
          "Super Admin Contact No. must be at least 9 digits",
          "सुपर प्रशासक संपर्क नंबर कम से कम 9 अंक का होना चाहिए"
        )
      )
      .max(
        999999999999999,
        getValidationMessage(
          language,
          "Super Admin Contact No. must be at most 15 digits",
          "सुपर प्रशासक संपर्क नंबर अधिकतम 15 अंक का होना चाहिए"
        )
      ),
    superAdminDocument: Yup.array().of(
      Yup.string().required(
        getValidationMessage(
          language,
          "Super Admin Documents are required",
          "सुपर प्रशासक के दस्तावेज़ आवश्यक हैं"
        )
      )
    ),
    superAdminName: Yup.string().required(
      getValidationMessage(language, "Name is required", "नाम आवश्यक है")
    ),
  });
  //Edit Functionality  Submit Button

  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const getParentId = JSON.parse(localStorage.getItem("ParentId"));
  const [initialValues, setinitialValues] = useState({
    name: "",
    address: "",
    societyRegistration: "",
    societyHouseList: "",
    societyContactNumber: "",
    societyLogo: "",
    createdBy: getRoleId,
    parentId: getParentId,
    defaultPermissionLevel: 4,
    role: "Society Admin",
    state:"",
    city:""
  });
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

  const handleSubmit = (values, { setSubmitting }) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to update the Society",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();

          for (let key in values) {
            if (values[key] !== null && values[key] !== undefined) {
              if (key === "societyLogo" && values.societyLogo instanceof File) {
                formData.append(key, values.societyLogo);
              } else if (Array.isArray(values[key])) {
                values[key].forEach((file, index) => {
                  formData.append(`${key}`, file);
                });
              } else {
                formData.append(key, values[key]);
              }
            }
          }
          await axios.put(
            `${PORT}/updateSocietyDeatilsWithId/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          Swal.fire({
            title: "Updated!",
            text: "Your Society has been Updated",
            icon: "success",
          }).then(() => {
            navigate(-1);
          });
        } catch (error) {
          console.error("Error updating entry:", error);
          // Display error message with SweetAlert
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the entry.",
            icon: "error",
          });
        }
      }
    });
  };
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? " Edit Society" : "संपादित करें सोसायटी"}
          </h5>

          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <br />

        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
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
                      maxLength="35"
                      required
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error_msg_society"
                    />
                  </div>
                  <div>
                    <label className="edit_society_lable" htmlFor="societyLogo">
                      {language === "hindi"
                        ? "Society Logo "
                        : "सोसायटी लोगो  "}
                          <span className="Star_color">*</span>
                    </label>
                    <br />
                    <input
                      type="file"
                      className="edit-input"
                      name="societyLogo"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue(
                          "societyLogo",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    <div className="eye-button-society-logo">
                      
                      <IoEyeSharp
                        onClick={handleOpen}
                        data-toggle="tooltip"
                        className="eyes_view"
                        data-placement="top"
                        title={language === "hindi" ? "view" : "देखना"}
                      />
                    
                    </div>
                  </div>
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
                  <div>
                    <label className="edit_society_lable" htmlFor="state">
                      {language === "hindi" ? " State" : "पता"}
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
                  <div>
                    <label className="edit_society_lable" htmlFor="state">
                      {language === "hindi" ? " City" : "पता"}
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
                    <label className="edit_society_lable" htmlFor="societyContactNumber">
                      {language === "hindi" ? "  Contact No." : "संपर्क संख्या"}
                      <span className="Star_color">*</span>
                    </label>
                    <br />
                    <Field
                      type="text"
                      className="edit-input"
                      id="societyContactNumber"
                      name="societyContactNumber"
                      required
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
                      type="text"
                      className="edit-input"
                      id="societyHouseList"
                      name="societyHouseList"
                      maxLength="10"
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
                        : "सोसायटी पंजीकरण संख्या "}
                      <span className="Star_color">*</span>
                    </label>

                    <br />
                    <Field
                      type="text"
                      className="edit-input"
                      id="societyRegistration"
                      name="societyRegistration"
                      maxLength="45"
                      required
                    />
                    <ErrorMessage
                      name="societyRegistration"
                      component="div"
                      className="error_msg_society"
                    />
                  </div>
              
                </div>
                <div className="society_bottom_btn_div">
                  <button className="society_btn" type="submit">
                    {language === "hindi" ? "    Submit" : "  जमा करना"}
                  </button>
                  <RevalidateOnLanguageChange />
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {/* Modal  For Society Logo     */}
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="modal_edit_entry_image"
          >
            <Box sx={style}>
              {getSocietyDeatils?.societyLogo ? (
                <div className="edit_Entry_image_modal">
                  <img
                    src={`/${getSocietyDeatils.societyLogo.replace(
                      "public/",
                      ""
                    )}`}
                    alt=""
                  />
                </div>
              ) : (
                <>
                  <h6>
                    {getSocietyDeatils?.name ? (
                      (() => {
                        let words = getSocietyDeatils.name.split(" ");
                        const initials = words[0]
                          ?.substring(0, 1)
                          .toUpperCase();
                        return (
                          <div className="purpose_default_icon">
                            <h5>{initials}</h5>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="align-middle text-center purpose_icon_title">
                        <h5 className="initialss">N/A</h5>
                      </div>
                    )}
                  </h6>
                </>
              )}
            </Box>
          </Modal>
        </div>
      </Layout>
      <ToastContainer />
      {/* //Edit Society Images */}
    </>
  );
};

export default EditSociety;
