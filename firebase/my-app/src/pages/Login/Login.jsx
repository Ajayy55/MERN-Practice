import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './style_Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider ,signInWithEmailAndPassword} from "firebase/auth";
import { handleError, handleSuccess } from '../../utils/Toastify';
import { ToastContainer } from 'react-toastify';
import { genToken } from '../../firebase-config';

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };
  const navigate=useNavigate();

  const sigInWithGoogle=()=>{
    const provider = new GoogleAuthProvider();
    const auth = getAuth(); 

    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log('userTOken:',token,'\n','user : ',user)

    if(user){
      localStorage.setItem('Token',user?.accessToken)
      localStorage.setItem('uid',user?.uid)
      localStorage.setItem('email',user.email)
      localStorage.setItem('user',user.displayName)
      let notifyToken=genToken()
      genToken()
      handleSuccess('Login successful')
      setTimeout(()=>{
          navigate('/')
      },1000)
    }

  }).catch((error) => {

    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    handleError(credential)
  });    
}


  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Replace with your login API endpoint
      // const response = await axios.post('/api/login', values);
      // Handle successful login (e.g., redirect or store user info)

      const auth = getAuth();
      signInWithEmailAndPassword(auth, values.email,values.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          if(user){
          localStorage.setItem('Token',user?.accessToken)
          localStorage.setItem('uid',user?.uid)
          localStorage.setItem('email',user.email)
          genToken()
          handleSuccess('Login successful')
          setTimeout(()=>{
              navigate('/')
          },1000)
        }
          
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.messa  ;
          console.log(error);
          handleError(error.code)
        });


      // console.log('Login successful!', response.data);
    } catch (error) {
      setErrors({ email: 'Login failed. Check your email and password.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
              <form className="login " onSubmit={handleSubmit}>
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
                  <Link to='/signup' className='text-dark fw-bold'>Don't have Account ? Signup </Link>
                  </div>
              </form>
            )}
          </Formik>
          <div className="social-login">
            <h5 className='text-decoration-underline'>Signin  With</h5>
            <div className="social-icons">
              <span className="social-login__icon ">
                <img src="./pngwing.com.png" alt="gmail" onClick={sigInWithGoogle} />
              </span>
              <a href="#" className="social-login__icon">
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
