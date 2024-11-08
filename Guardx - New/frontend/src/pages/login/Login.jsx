import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PORT } from "../../port/Port";
import axios from 'axios'
import Swal from 'sweetalert2'

function Login() {

const key = '!23Big45Basket#Hasing@666#!';
const keyPair = ['5','1','9','6','3','5','7','9','0'];

const hashPassword = (password) => {
    let result = '';
    for (let i = 0; i < password.length; i++) {
        // Add the password character and corresponding key character
        result += password[i] + key[keyPair[i % keyPair.length]];
    }
    console.log("Hashed password:", result);
    return result;
}

// Example usage
// const hashedPassword = hashPassword();

// Unhash password by reversing the pattern
const unHashPassword = (hashedPassword) => {
    let result = '';
    for (let i = 0; i < hashedPassword.length; i += 2) {
        // Take every second character (the original password character)
        result += hashedPassword[i];
    }
    console.log("Unhashed password:", result);
    return result;
}

// Example unhashing
unHashPassword('Agj2aay4sBogo5da');
  // Formik configuration 
  const navigate=useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Username or email is required"),
      password: Yup.string()
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      // Handle form submission logic here
      // console.log("Form values:", values);
      try {
        
        const url = `${PORT}login`;
        const response = await axios.post(url, values);
        // console.log(response);
        
        if (response.status === 200) {
            const Responsedata=response?.data.user;
          
            // console.log('k',Responsedata);
            if(Responsedata.isActive===true)
            {
              if(values.rememberMe==true){
                const hashEmail= hashPassword(values.email)
                const hashPass= hashPassword(values.password)
                localStorage.setItem('username',hashEmail)
                localStorage.setItem('pass',hashPass)
               }

              localStorage.setItem('token',response.data.jwtToken)
            
                if(Responsedata?.permissionLevel===1)
                {
                      Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "welcome Super Admin",
                    showConfirmButton: false,
                    timer: 1500
                      });
                      setTimeout(()=>{
                      navigate('/')
                      },1000)
                }
                else if(Responsedata?.permissionLevel===2){
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome SAAS Admin",
                    showConfirmButton: false,
                    timer: 1500
                      });
                      setTimeout(()=>{
                      navigate('/')
                      },1000)
                }else{
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome User",
                    showConfirmButton: false,
                    timer: 1500
                      });
                      setTimeout(()=>{
                      navigate('/')
                      },1000)
                }


            }else{
              console.error("InActive User");
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Registration failed",
                text: "You Account has been inActive pls contact Admin",
                showConfirmButton: true
            });
            }
            
        }
        
      } catch (error) {
        console.error("Login failed:", error);
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
                  <h3 className="card-title text-start mb-3">Login</h3>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label>Username or email *</label>
                      <input
                        type="text"
                        name="email"
                        className="form-control p_input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control p_input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                      ) : null}
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          id="rememberMe"
                          className="form-check-input"
                          onChange={formik.handleChange}
                          checked={formik.values.rememberMe}
                        />
                        <label htmlFor="rememberMe" className="form-check-label">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="forgot-pass">
                        Forgot password
                      </a>
                    </div>
                    <div className="text-center d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block enter-btn"
                      >
                        Login
                      </button>
                    </div>

                    <div className="d-flex">
                      <button type="button" className="btn btn-facebook me-2 col">
                        <i className="mdi mdi-facebook" /> Facebook
                      </button>
                      <button type="button" className="btn btn-google col">
                        <i className="mdi mdi-google-plus" /> Google plus
                      </button>
                    </div>
                    <p className="sign-up">
                      Don't have an Account?<Link to='/signup'> Sign Up</Link>
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

export default Login;
