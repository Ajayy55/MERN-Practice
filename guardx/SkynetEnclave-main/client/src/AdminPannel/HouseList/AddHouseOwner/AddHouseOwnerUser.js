import React, { useContext, useRef, useState } from "react";
import "./style.css";
import { LanguageContext } from "../../../lib/LanguageContext";
import { Formik, Form, Field } from "formik";
import { MdOutlineEmail, MdOutlineSaveAlt } from "react-icons/md";
import { FaRegUser, FaPhoneAlt, FaImages } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PORT } from "../../../Api/api";

const AddHouseOwnerUser = ({ data }) => {
  const { language } = useContext(LanguageContext);
  const [step, setStep] = useState(1);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const [isRwaMember, setIsRwaMember] = useState("no"); // Initialize state with "no"
  const id = data;

  const initialValues = {
    ownerName: "",
    userPhoneNo: "",
    username: "",
    password: "",
    confirmpassword: "",
    ownerImages: "",
    aadhaarNumber: "",
  };

  const validateStep1 = (values) => {
    const errors = {};
    if (
      values.username &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.username)
    ) {
      errors.username = "Invalid email address";
    }
    if (values.password && values.password.length <= 5) {
      errors.password = "Password must be longer than 6 characters";
    }
    if (values.password && !values.confirmpassword) {
      errors.confirmpassword = "Confirm password is required";
    }
    if (
      values.password &&
      values.confirmpassword &&
      values.password !== values.confirmpassword
    ) {
      errors.confirmpassword = "Passwords must match";
    }

    return errors;
  };

  const validateStep2 = (values) => {
    const errors = {};
    if (!values.ownerName) {
      errors.ownerName = "Owner name is required";
    }
    if (values.ownerName && values.ownerName.length > 35) {
      errors.ownerName = "Name cannot exceed 35 characters";
    }

    return errors;
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key !== "ownerImages") {
        formData.append(key, values[key]);
      }
    });
    if (values.ownerImages) {
      formData.append("ownerImages", values.ownerImages);
    }
    formData.append("isRwaMember", isRwaMember); 
    axios
      .post(`${PORT}/addHouseOwner/${id}`, formData)
      .then((res) => {
        console.log(res, "res");
        resetForm();
        toast.success(res.data.message);
        setStep(1);
      })
      .catch((error) => {
        console.log(error, "error");
        toast.error(error.response.data.error);
      });
  };
  const handleNext = (validateForm, setTouched) => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setStep(step + 1);
      } else {
        if (step === 1) {
          setTouched({
            ownerName: true,
          });
        }
      }
    });
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={step === 1 ? validateStep2 : validateStep1} // Switch validation for the steps
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue, validateForm, setTouched }) => (
          <Form className="add-house-detail-section">
            {/* Form Title */}
            <div className="add-house-detail-title-div">
              {language === "hindi" ? "Owner Details" : "मालिक के विवरण"}
            </div>

            <div className="add-house-detail-inner-section">
              {step === 1 && (
                <>
                  <div className="form-container-house1">
                    {/* Full Name Field */}
                    <div className="input-container-house">
                      <label>
                        {language === "hindi" ? "Owner Name" : "मालिक का नाम"}{" "}
                        <span className="important_field">*</span>
                      </label>
                      <div className="input-with-icon-house">
                        <Field
                          type="text"
                          maxLength={35}
                          name="ownerName"
                          placeholder="Enter your full name"
                        />
                        <FaRegUser className="input-icon" />
                      </div>
                      {errors.ownerName && touched.ownerName && (
                        <div className="error">{errors.ownerName}</div>
                      )}
                    </div>

                    {/* Mobile Number Field */}
                    <div className="input-container-house">
                      <label>
                        {language === "hindi" ? "Mobile Number" : "मोबाइल नंबर"}{" "}
                      </label>
                      <div className="input-with-icon-house">
                        <Field
                          type="number"
                          onInput={(e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                          name="userPhoneNo"
                          placeholder="Enter your mobile number"
                        />
                        <FaPhoneAlt className="input-icon" />
                      </div>
                    </div>

                    {/* Add Member Images */}
                    <div className="input-container-house">
                      <label>
                        {language === "hindi"
                          ? "Owner Images"
                          : "मालिक की छवियां"}
                      </label>
                      <div className="input-with-icon-house">
                        <input
                          type="file"
                          name="ownerImages"
                          placeholder="Add Owner Images"
                          accept="image/*"
                          onChange={(event) => {
                            setFieldValue(
                              "ownerImages",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        <FaImages className="input-icon" />
                      </div>
                    </div>
                    <div className="input-container-house">
                      <label>
                        {language === "hindi" ? "Aadhaar No." : "आधार संख्या"}
                      </label>
                      <div className="input-with-icon-house">
                        <Field
                          type="text"
                          name="aadhaarNumber"
                          placeholder="Enter Aadhaar No."
                          onInput={(e) => {
                            if (e.target.value.length > 12) {
                              e.target.value = e.target.value.slice(0, 12);
                            }
                          }}
                        />
                        <FaImages className="input-icon" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-container-house2">
                    {/* Email Address Field */}
                    <div className="input-container-house">
                      <label>
                        {language === "hindi" ? "Email Address" : "ईमेल पता"}{" "}
                      </label>
                      <div className="input-with-icon-house">
                        <Field
                          type="email"
                          name="username"
                          maxLength={40}
                          placeholder="Enter your email"
                        />
                        <MdOutlineEmail className="input-icon" />
                      </div>
                      {errors.username && touched.username && (
                        <div className="error">{errors.username}</div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="input-container-house">
                      <label>
                        {language === "hindi"
                          ? "Password"
                          : "पासवर्ड दर्ज करें"}{" "}
                      </label>
                      <div className="input-with-icon-house">
                        <Field
                          type="text"
                          name="password"
                          placeholder="Enter your password"
                          maxLength={30}
                        />
                        <TbPasswordUser className="input-icon" />
                      </div>
                      {errors.password && touched.password && (
                        <div className="error">{errors.password}</div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="input-container-house">
                      <label>
                        {language === "hindi"
                          ? "Confirm Password"
                          : "पासवर्ड की पुष्टि करें"}{" "}
                      </label>
                      <div className="input-with-icon-house">
                        <Field
                          type="password"
                          name="confirmpassword"
                          placeholder="Confirm your password"
                          maxLength={30}
                        />
                        <TbPasswordUser className="input-icon" />
                      </div>
                      {errors.confirmpassword && touched.confirmpassword && (
                        <div className="error">{errors.confirmpassword}</div>
                      )}
                    </div>
                    <div className="input-container-house">
                      <label>
                        {language === "english"
                          ? "RWA सदस्य हैं?"
                          : "Is this an RWA member?"}
                      </label>
                      <div className="input-with-radio-house-icon ">
                        <label>
                          <Field
                         type="radio"
                         name="isRwaMember"
                         value="yes"
                         checked={isRwaMember === "yes"}
                         onChange={() => setIsRwaMember("yes")}
                          />
                          Yes
                        </label>
                        <label>
                          <Field
                         type="radio"
                         name="isRwaMember"
                         value="no"
                         checked={isRwaMember === "no"}
                         onChange={() => setIsRwaMember("no")}
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <br />

            {/* Navigation Buttons */}
            <div className="add-society-house-form-action-buttons">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="add-society-house-save-button"
                >
                  {language === "hindi" ? "Back" : "पीछे"}
                </button>
              )}

              {step < 2 && (
                <button
                  type="button"
                  onClick={() => handleNext(validateForm, setTouched)}
                  className="add-society-house-save-button"
                >
                  {language === "hindi" ? "Next" : "अगला"}
                </button>
              )}

              {step === 2 && (
                <button type="submit" className="add-society-house-save-button">
                  <MdOutlineSaveAlt className="add-society-house-form-action-buttons-icon" />{" "}
                  {language === "hindi" ? "Save" : "सहेजें"}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default AddHouseOwnerUser;
