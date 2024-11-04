import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./style_Signup.css";
import axios from "axios";

const Signup = () => {
  const initialValues = {
    email: "",
    username: "",
    mobile: "",
    password: "",
    gender: "",
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    username: Yup.string().required("Username is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    gender: Yup.string().required("Gender required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      console.log(user);

      if (user) {
        try {
          const url = `${process.env.REACT_APP_PORT}register`;
          const response = await axios.post(url, values);
          console.log(response);
          if (response.status === 201) {
            handleSuccess(response?.data?.message);
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          } 

        } catch (error) {
          await deleteUser(user);
          console.log("user register failed monogoDb error", error);
          handleError(error?.response?.data?.message);
        }
      } else {
        handleError("firebase user auth failed");
      }
    } catch (error) {
      console.error(error);
      handleError(error.message); // Display Firebase error message
      setErrors({ email: "Signup failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    width: "420px",
                    padding: "30px",
                    paddingTop: "50px",
                  }}
                >
                  <div className="login_heading">Signup / Register</div>

                  <div className="login__field">
                    <i className="login__icon fas fa-user"></i>
                    <input
                      type="text"
                      className="login__input"
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email && (
                      <div className="error-message">{errors.email}</div>
                    )}
                  </div>

                  <div className="login__field">
                    <i className="login__icon fas fa-user"></i>
                    <input
                      type="text"
                      className="login__input"
                      placeholder="Enter Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.username && touched.username && (
                      <div className="error-message">{errors.username}</div>
                    )}
                  </div>

                  <div className="login__field">
                    <label htmlFor="gender" className="me-3">
                      Gender:
                    </label>
                    <input
                      type="radio"
                      className="me-1"
                      name="gender"
                      id="male"
                      value="male"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="male" className="me-2">
                      Male
                    </label>

                    <input
                      type="radio"
                      className="mx-1"
                      name="gender"
                      id="female"
                      value="female"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="female" className="me-2">
                      Female
                    </label>

                    <input
                      type="radio"
                      className="mx-1"
                      name="gender"
                      id="other"
                      value="other"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label htmlFor="other" className="me-2">
                      Other
                    </label>
                    {errors.gender && touched.gender && (
                      <div className="error-message">{errors.gender}</div>
                    )}
                  </div>

                  <div className="login__field">
                    <i className="login__icon fas fa-phone"></i>
                    <input
                      type="text"
                      className="login__input"
                      placeholder="Enter Mobile Number"
                      name="mobile"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.mobile && touched.mobile && (
                      <div className="error-message">{errors.mobile}</div>
                    )}
                  </div>

                  <div className="login__field">
                    <i className="login__icon fas fa-lock"></i>
                    <input
                      type="password"
                      className="login__input"
                      placeholder="Enter Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password && (
                      <div className="error-message">{errors.password}</div>
                    )}
                  </div>

                  <button
                    className="login__submit"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span className="button__text">Sign Up</span>
                    <i className="button__icon fas fa-chevron-right"></i>
                  </button>
                  <div className="mt-5">
                    <Link to="/" className="text-dark fw-bold">
                      Already have an account? Login
                    </Link>
                  </div>
                </form>
              )}
            </Formik>
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
