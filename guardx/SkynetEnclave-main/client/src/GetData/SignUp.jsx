import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PORT } from "../Api/api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function SignUp({ language }) {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    phone: "",
    password: "",
  };
  const validationSchema = (language) =>
    Yup.object().shape({
      username: Yup.string()
        .min(
          6,
          `${
            language === "hindi"
              ? "Username must be of minimum 6 characters"
              : "उपयोगकर्ता नाम कम से कम 6 अक्षरों का होना चाहिए"
          }`
        )
        .required(
          `${
            language === "hindi"
              ? "Username is required"
              : "उपयोगकर्ता नाम आवश्यक है"
          }`
        ),
      phone: Yup.string()
        .matches(
          /^[0-9]{10}$/,
          `${
            language === "english"
              ? "Phone number must be of 10 digits and in correct format"
              : "फोन नंबर 10 अंकों का होना चाहिए और सही प्रारूप में होना चाहिए"
          }`
        )
        .required(
          `${
            language === "hindi"
              ? "Phone number is required"
              : "फोन नंबर आवश्यक है"
          }`
        ),
      password: Yup.string()
        .min(
          6,
          `${
            language === "hindi"
              ? "Password must be at least 6 characters"
              : "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"
          }`
        )
        .required(
          `${
            language === "hindi" ? "Password is required" : "पासवर्ड आवश्यक है"
          }`
        ),
    });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
    try {
      const response = await axios.post(`${PORT}/signup`, {
        username: values.username,
        userPhoneNo: values.phone,
        password: values.password,
      });
      // console.log("Data"  , response)

      if (response.data.success === true) {
        let localData = {
          userName: values.username,
          userPassword: values.password,
        };
        localStorage.setItem("data", JSON.stringify(localData));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${
            language !== "english"
              ? "Signup successfull !"
              : "साइन अप सफलतापूर्वक हुआ!"
          }`,
          showConfirmButton: false,
          timer: 1500,
        });
        values.username = "";
        values.phone = "";
        values.password = "";
        navigate("/admin/home");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.msg === "Username already exists"
      ) {
        const message =
          language !== "english"
            ? "Username already exists"
            : "उपयोगकर्ता नाम पहले से ही मौजूद है";
        toast.warning(message);
      } else {
        const message =
          language !== "english" ? "Data not added" : "डेटा नहीं जोड़ा गया";
        toast.error(message);
      }
    }
  };

  return (
    <div className="main-form">
      <div className="form-container">
        <h2>{language === "english" ? "साइन अप करें" : "Sign Up"}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema(language)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field">
                <label htmlFor="username">
                  {language === "english" ? "उपयोगकर्ता नाम" : "Username"}
                </label>
                <Field type="text" name="username" />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone">
                  {language === "english" ? "फ़ोन नंबर" : "Phone Number"}
                </label>
                <Field type="text" name="phone" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-field">
                <label htmlFor="password">
                  {language === "english" ? "पासवर्ड" : "Password"}
                </label>
                <Field type="password" name="password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {language === "english" ? "सबमिट" : "Submit"}
              </button>
              <div onClick={() => navigate("/login")} className="s-page">
                {language === "english" ? (
                  <>
                    पहले से साइन अप किया है? <span>लॉगिन</span>
                  </>
                ) : (
                  <>
                    Already SignUp ? <span>Login</span>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SignUp;
