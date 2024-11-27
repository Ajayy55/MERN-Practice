import React from 'react';  
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../layout/Layout';
import BackButton from '../utils/BackButton';
import { useLocation } from 'react-router-dom';
import { swal } from 'sweetalert2/dist/sweetalert2';
import Swal from "sweetalert2";


const customButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 11px',
  cursor: 'pointer',
  borderRadius: '5px',
  display: 'inline-block',
  textAlign: 'center',
  width: '90%',
};

function AddRegularEntry() {
  const location = useLocation();
  const entry = location.state;

  // Formik initial values
//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       gender: '',
//       mobile: '',
//       aadhaar: '',
//       address: '',
//       regularProfileImage: '',
//       regularAadharImage: '',
//       regularOtherProof: '',
//     },
//     validationSchema: Yup.object({
//         name: Yup.string().required('Name is required'),
//         gender: Yup.string().required('Gender is required'),
//         mobile: Yup.string()
//           .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
//           .required('Mobile number is required'),
//         aadhaar: Yup.string()
//           .matches(/^[0-9]{12}$/, 'Aadhaar number must be 12 digits')
//           .required('Aadhaar number is required'),
//         address: Yup.string().required('Address is required'),
//         regularProfileImage: Yup.mixed().required('Profile image is required'),
//         regularAadharImage: Yup.mixed().nullable(),
//         regularOtherProof: Yup.mixed().nullable(),
//       }).test(
//         'at-least-one-upload',
//         'Either Aadhaar Image or Other Proof is required',
//         function (values) {
//           // Check that at least one of the two fields is provided
//           const { regularAadharImage, regularOtherProof } = values;
      
//           // Verify that one of the fields is truthy (a file exists)
//           return regularAadharImage || regularOtherProof;
//         }
//       ),
//     onSubmit: (values) => {
      
//       if(values.regularOtherProof==="" ||values.regularAadharImage==="")
//       {
//         return alert('Either Aadhaar Image or Other Proof is required')
//       }
//       console.log('Form Submitted:', values);
//       alert('Form Submitted Successfully!');
//     },
//   });
const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      mobile: '',
      aadhaar: '',
      address: '',
      regularProfileImage: null,
      regularAadharImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      gender: Yup.string().required('Gender is required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),
      aadhaar: Yup.string()
        .matches(/^[0-9]{12}$/, 'Aadhaar number must be 12 digits')
        .required('Aadhaar number is required'),
      address: Yup.string().required('Address is required'),
      regularProfileImage: Yup.mixed().required('Profile image is required'),
      regularAadharImage: Yup.mixed().required('Proof required'),
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      alert('Form submitted successfully!');
    },
  });
  
console.log(formik.errors);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
            <div>
              <BackButton />
            </div>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <div className="card p-5">
                <h3 className="card-title mb-3">Add {entry?.title}</h3>

                <div className="row">
                  {/* Name */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-danger">{formik.errors.name}</div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="gender" className="form-label">
                      Select Gender <span className="text-danger">*</span>
                    </label>
                    <div className='d-flex'>
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <div className="" key={gender}>
                          <input
                            className="form-check-input me-1"
                            type="radio"
                            id={gender.toLowerCase()}
                            name="gender"
                            value={gender}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label
                            className="form-check-label me-3"
                            htmlFor={gender.toLowerCase()}
                          >
                            {gender}
                          </label>
                        </div>
                      ))}
                    </div>  
                    {formik.touched.gender && formik.errors.gender && (
                      <div className="text-danger">{formik.errors.gender}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Mobile Number */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="mobile" className="form-label">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <div className="text-danger">{formik.errors.mobile}</div>
                    )}
                  </div>

                  {/* Aadhaar Number */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="aadhaar" className="form-label">
                      Aadhaar Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="aadhaar"
                      name="aadhaar"
                      value={formik.values.aadhaar}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.aadhaar && formik.errors.aadhaar && (
                      <div className="text-danger">{formik.errors.aadhaar}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Address */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="address" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control customTextarea"
                      id="address"
                      name="address"
                      rows={8}
                      style={{ height: '110px' }}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-danger">{formik.errors.address}</div>
                    )}
                  </div>

                  {/* File Uploads */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="uploads" className="form-label">
                      Uploads
                    </label>
                    <div className="mb-3">
                      <input
                        type="file"
                        id="regularProfileImage"
                        name="regularProfileImage"
                        onChange={(event) =>
                          formik.setFieldValue(
                            'regularProfileImage',
                            event.currentTarget.files[0]
                          )
                        }
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="regularProfileImage"
                        style={customButtonStyle}
                      >
                        Upload Profile Image <span className="text-danger">*</span>
                      </label>
                      { formik.errors.regularProfileImage && (
                      <div className="text-danger">{formik.errors.regularProfileImage}</div>
                    )}
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        id="regularAadharImage"
                        name="regularAadharImage"
                        onChange={(event) =>
                          formik.setFieldValue(
                            'regularAadharImage',
                            event.currentTarget.files[0]
                          )
                        }
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="regularAadharImage"
                        style={customButtonStyle}
                      >
                        Upload Aadhaar/Other Proof <span className="text-danger">*</span>
                      </label>
                      { formik.errors.regularAadharImage && (
                      <div className="text-danger">{formik.errors.regularAadharImage}</div>
                    )}
                    </div>
                    {formik.errors['regularAadharImage'] ||
                    formik.errors['regularOtherProof'] ? (
                      <div className="text-danger">
                     
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                  <div className="col-md-8">
                    <button type="submit" className="btn btn-primary mt-3">
                      Add {entry?.title}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddRegularEntry;
