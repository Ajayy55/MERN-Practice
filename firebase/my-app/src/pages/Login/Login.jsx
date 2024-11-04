import React, { useCallback } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './style_Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { handleError, handleSuccess } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';
import { deleteFCMToken, genToken } from '../../firebase-config';
import { debounce } from 'lodash';

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
    FCM_Token:'',
  };
  const navigate = useNavigate();

  const signInWithGoogle =async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Get credential and user information
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
  
      if (user) {
        // Prepare user data for backend storage
        await deleteFCMToken();
        const userData = {
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          photoURL: user.photoURL,
          FCM_Token:await genToken()
        };
  

        // Send user data to your backend for storage in MongoDB
        const response = await axios.post(`${process.env.REACT_APP_PORT}SignInWithGoogle`, userData);
  
        if (response.status === 200) {

         // Store user details in local storage
        localStorage.setItem('Token', token);
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('email', user.email);
        localStorage.setItem('user', user.displayName);
          handleSuccess('Login successful');
  
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          handleError('Failed to store user information in the database.');
        }
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log(values);
    
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
         await deleteFCMToken();
        localStorage.setItem('Token', user.accessToken);
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('email', user.email);
        values.FCM_Token=await genToken();
        try{
               // Send login info to your backend
        const response = await axios.post(`${process.env.REACT_APP_PORT}login`, values);
        console.log('Login response:', response);

        if (response.status === 200) {
         
          handleSuccess('Login successful');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
          
        }
        catch(error){
          console.log(error)
        }
   
      }
    } catch (error) {
      const errorMessage = error.message;
      console.error('Authentication error:', error);
      handleError(errorMessage);
      setErrors({ email: 'Login failed. Check your email and password.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Debounce the handleSubmit function
  const debouncedHandleSubmit = useCallback(
    debounce(handleSubmit, 1000), // 5 seconds debounce
    []
  );

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                debouncedHandleSubmit(values, actions);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form className="login" onSubmit={handleSubmit}>
                  <div className='login_heading mb-4'>Login</div>
                  <div className="login__field">
                    <i className="login__icon fas fa-user"></i>
                    <input
                      type="text"
                      className="login__input"
                      placeholder="User name / Email"
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
                    <i className="login__icon fas fa-lock"></i>
                    <input
                      type="password"
                      className="login__input"
                      placeholder="Password"
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
                    <span className="button__text">Log In Now</span>
                    <i className="button__icon fas fa-chevron-right"></i>
                  </button>
                  <div className="mt-5">
                    <Link to='/signup' className='text-dark fw-bold'>Don't have an Account? Signup</Link>
                  </div>
                </form>
              )}
            </Formik>
            <div className="social-login">
              <h5 className='text-decoration-underline'>Sign In With</h5>
              <div className="social-icons">
                <span className="social-login__icon ">
                  <img src="./pngwing.com.png" alt="gmail" onClick={signInWithGoogle} />
                </span>
                <a className="social-login__icon">
                  <img src="./pngwing.com (1).png" alt="Facebook" />
                </a>
              </div>
            </div>
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

export default Login;
