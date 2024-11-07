import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PORT } from "../../port/Port";
import axios from 'axios'
import Swal from 'sweetalert2'

function Signup() {
  const navigate=useNavigate();
  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required").min(4,"Username must have atleast 4 char"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const url = `${PORT}registerHouse`;
  
      try {
          const response = await axios.post(url, values);
          console.log(response);
  
          if (response.status === 201) {
              Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "You have been Registered Successfully",
                  showConfirmButton: false,
                  timer: 1500
              });
              setTimeout(()=>{
                navigate('/login')
              },1000)
              
          }
      } catch (error) {
          console.error("Error during registration:", error);
          
          // Show error alert with error message, if available
          Swal.fire({
              position: "center",
              icon: "error",
              title: "Registration failed",
              text: error.response?.data?.message || "An unexpected error occurred. Please try again.",
              showConfirmButton: true
          });
      }
  },
  
  });

  return (
    <>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="row w-100">
            <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
              <div className="card col-lg-4 mx-auto">
                <div className="card-body px-5 py-5">
                  <h3 className="card-title text-start mb-3">Register</h3>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control p_input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        required
                        maxLength={50}
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="text-danger">{formik.errors.username}</div>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control p_input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        required
                        maxLength={50}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <label>Mobile</label>
                      <input
                        type="number"
                        name="mobile"
                        className="form-control p_input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                      />
                      {formik.touched.mobile && formik.errors.mobile ? (
                        <div className="text-danger">{formik.errors.mobile}</div>
                      ) : null}
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control p_input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        required
                        maxLength={50}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                      ) : null}
                    </div>

                    <div className="text-center d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block enter-btn"
                      >
                        Register
                      </button>
                    </div>

                    <div className="d-flex">
                      <button className="btn btn-facebook col me-2">
                        <i className="mdi mdi-facebook" /> Facebook{" "}
                      </button>
                      <button className="btn btn-google col">
                        <i className="mdi mdi-google-plus" /> Google plus{" "}
                      </button>
                    </div>
                    <p className="sign-up text-center">
                      Already have an Account?<Link to='/login'> Log In</Link>
                    </p>
                    <p className="terms">
                      By creating an account you are accepting our
                      <a href="#"> Terms &amp; Conditions</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
