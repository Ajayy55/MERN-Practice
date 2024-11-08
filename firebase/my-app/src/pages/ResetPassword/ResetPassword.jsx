import React, { useState } from 'react';
import './resetStyle.css';
import { Formik } from 'formik';
import * as Yup from 'yup';

function ResetPassword() {
  const [passField, setPassField] = useState(true);

  const initialValues = {
    otp: '',
    newPassword: '',
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(4, 'OTP must be 4 digits')
      .required('OTP is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
  });

  const handleOTPSubmit = (values) => {
    console.log('OTP Submitted:', values.otp);
    setPassField(false); // Enable password field after OTP validation
  };

  return (
    <>
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                handleOTPSubmit(values);
                actions.setSubmitting(false);
              }}
            >
              {({ handleSubmit, handleChange, values, errors, touched }) => (
                <form className="ResetPass" onSubmit={handleSubmit}>
                  <div className="login_heading mb-4">Reset Password</div>
                  <div className="ResetPass__field">
                    <i className="ResetPass__icon fas fa-user"></i>
                    <input
                      type="text"
                      className="ResetPass__input"
                      placeholder="Enter OTP"
                      maxLength={4}
                      name="otp"
                      value={values.otp}
                      onChange={handleChange}
                    />
                    {touched.otp && errors.otp && <div className="error">{errors.otp}</div>}
                  </div>
                  <button type="button" className="button ResetPass__submit">
                    <span className="button__text">Submit OTP</span>
                    <i className="button__icon fas fa-chevron-right"></i>
                  </button>
                  
                  <div className="ResetPass__field">
                    <i className="ResetPass__icon fas fa-lock"></i>
                    <input
                      type="password"
                      className="ResetPass__input"
                      placeholder="New Password"
                      disabled={passField}
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                    />
                    {touched.newPassword && errors.newPassword && <div className="error">{errors.newPassword}</div>}
                  </div>
                  <button type="submit" className="button ResetPass__submit" style={{ width: '75%' }}>
                    <span className="button__text">Change Password</span>
                    <i className="button__icon fas fa-chevron-right"></i>
                  </button>
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
}

export default ResetPassword;
