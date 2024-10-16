import React, { useEffect, useState } from 'react'
import Layout from '../../layouts/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, useFormik } from 'formik';
import { handleError, handleSuccess } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { PORT } from '../../PORT/PORT';
import { LoginSchema } from '../../schema/LoginSchema';
import Swal from "sweetalert2/dist/sweetalert2.js";


const initialValues = {
    email: '',
    password: "",
}


function Login() {
    const [rememberMe,setRemeberMe]=useState(false);
    const [savedData,setSavedData]=useState({email:'',password:''})
    

    const navigate=useNavigate();


    const { values, errors, handleBlur, touched,handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema:LoginSchema,
        onSubmit: async(values) => {
           try {           

            console.log(values,rememberMe);
       
            
             const url=`${PORT}login`;
             const response=await axios.post(url,values);
             console.log(response);
            
                if(response.status===200){

                  if(rememberMe){
                     localStorage.setItem('Token',response?.data?.Token)

                      localStorage.setItem('email',values.email)
                      localStorage.setItem('password',values.password)

                      } else{
                     sessionStorage.setItem("Token",response?.data?.Token)
                       }

                    handleSuccess(response?.data?.message)
                    setTimeout(()=>{navigate('/dashboard')},1000)
                }

           } catch (error) {
            console.log('error while Signup ',error);
            handleError(error.response.data.message)
           }
        },
    }
    )

    useEffect(()=>{
      if(localStorage.getItem('email') || localStorage.getItem('password')){
        values.email=localStorage.getItem('email');
        values.password=localStorage.getItem('password');
      }
    },[])
  

  return (
<>
<>
  <div className="container position-sticky z-index-sticky top-0">
    <div className="row">
      <div className="col-12">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg blur border-radius-lg top-0 z-index-3 shadow position-absolute mt-4 py-2 start-0 end-0 mx-4">
          <div className="container-fluid">
            <Link to='/dashboard'
              className="navbar-brand font-weight-bolder ms-lg-0 ms-3 "
            >
              Argon Dashboard 2
            </Link>
            <button
              className="navbar-toggler shadow-none ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navigation"
              aria-controls="navigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon mt-2">
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </span>
            </button>
            <div className="collapse navbar-collapse" id="navigation">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link to='/dashboard'
                    className="nav-link d-flex align-items-center me-2 active"
                    aria-current="page"
                    href=""
                  >
                    <i className="fa fa-chart-pie opacity-6 text-dark me-1" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link me-2" href="">
                    <i className="fa fa-user opacity-6 text-dark me-1" />
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <Link to={'/signup'} className="nav-link me-2">
                    <i className="fas fa-user-circle opacity-6 text-dark me-1" />
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/login'} className="nav-link me-2" >
                    <i className="fas fa-key opacity-6 text-dark me-1" />
                    Sign In
                  </Link>
                </li>
              </ul>
              
            </div>
          </div>
        </nav>
        {/* End Navbar */}
      </div>
    </div>
  </div>
  <main className="main-content  mt-0">
    <section>
      <div className="page-header min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto">
              <div className="card card-plain">
                <div className="card-header pb-0 text-start">
                  <h4 className="font-weight-bolder">Sign In</h4>
                  <p className="mb-0">
                    Enter your email and password to sign in
                  </p>
                </div>
                <div className="card-body">
                  <form  onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Email"
                        aria-label="Email"
                        name='email'
                        value={values.email} onChange={handleChange} onBlur={handleBlur}
                        required
                        maxLength={50}
                      />
                     {errors.email&& touched.email ?(<span className='text-danger text-sm'>{errors.email}</span>):null}

                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        aria-label="Password"
                        name='password'
                        value={values.password} onChange={handleChange} onBlur={handleBlur}
                        required
                        maxLength={40}
                      />
                     {errors.password&& touched.password ?(<span className='text-danger text-sm'>{errors.password}</span>):null}

                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        name='rememberMe'
                         onChange={()=>{rememberMe?setRemeberMe(false):setRemeberMe(true)}}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary btn-lg w-100 mt-4 mb-0"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card-footer text-center pt-0 px-lg-2 px-1">
                  <p className="mb-4 text-sm mx-auto">
                    Don't have an account?
                    <Link to='/signup'
                      className="text-primary text-gradient font-weight-bold"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column">
              <div
                className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style={{
                  backgroundImage:
                    'url("https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg")',
                  backgroundSize: "cover"
                }}
              >
                <span className="mask bg-gradient-primary opacity-6" />
                <h4 className="mt-5 text-white font-weight-bolder position-relative">
                  "Attention is the new currency"
                </h4>
                <p className="text-white position-relative">
                  The more effortless the writing looks, the more effort the
                  writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <ToastContainer/>
</>

</>

    
  )
}

export default Login
