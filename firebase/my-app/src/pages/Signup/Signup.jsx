import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './style_Signup.css';
import { Link, useNavigate } from 'react-router-dom';
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { handleError, handleSuccess, } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';


const Signup = () => {
  const initialValues = {
    email: '',
    username: '',
    mobile: '',
    password: ''
  };
  const navigate=useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    username: Yup.string()
      .required('Username is required'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
    //   const response = await axios.post('/api/signup', values);
        // console.log('Signup successful!', values);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth,values.email, values.password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);  
            

            if(user){
                // localStorage.setItem('Token',user?.accessToken)
                // localStorage.setItem('uid',user?.uid)
                // localStorage.setItem('email',user.email)
                handleSuccess('Sign up successful')
                setTimeout(()=>{
                    navigate('/login')
                },1000)
            }
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
            handleError(error.code)
            // ..
        });



    } catch (error) {
      setErrors({ email: 'Signup failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (<>
  <ToastContainer/>
    <div className="container">
        
      <div className="screen">
        <div className="screen__content">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form 
                style={{ 
                  width: '320px', 
                  padding: '30px', 
                  paddingTop: '50px' 
                }} 
                onSubmit={handleSubmit}
              >
                <div className='login_heading'>Signup / Register</div>

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
                
                <button className="button login__submit" type="submit" disabled={isSubmitting}>
                  <span className="button__text">Sign Up</span>
                  <i className="button__icon fas fa-chevron-right"></i>
                </button> 
                <div className="mt-5">
                  <Link to='/' className='text-dark fw-bold'>Alraedy have Account ? Login </Link>
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
