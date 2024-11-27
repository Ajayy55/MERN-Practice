import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Layout from "../../layout/Layout";
import BackButton from "../utils/BackButton";
import axios from "axios";
import { PORT } from "../../port/Port";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const AddHouse = () => {
  const Token=localStorage.getItem('token');
  const navigate=useNavigate();

  // Formik with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      houseNo: "",
      blockNo: "",
      createdBy:"",
      society:""
    },
    validationSchema: Yup.object({
      houseNo: Yup.string()
        .required("House Number is required")
        .matches(/^[A-Za-z0-9]+$/, "Invalid characters in House Number"),
      blockNo: Yup.string()
        .required("Block Number is required")
        .matches(/^[A-Za-z0-9]+$/, "Invalid characters in Block Number"),
    }),
    onSubmit: async(values) => {
      // console.log("Form Submitted", values);
      const url=`${PORT}addHouseByAdmin`
    try {
        const response=await axios.post(url,values)
        // console.log('res' ,response);
        if (response.status == 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response?.data.message || " House Added Succesfully",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/houseList");
          }, 1000);
        }


    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error?.response?.data.message || " An Error Occured while Adding House",
        showConfirmButton: false,
        timer: 1500,
      });
      
    }
      
      // Add your submission logic here
    },
  });

  useEffect(()=>{
    console.log('use');
    if(Token){
     
      
      try {
        const decoded = jwtDecode(Token);
        
        if (decoded) {
          formik.setValues({
            createdBy:decoded.id || null,
            society:decoded.society ||null,
          })
        
          
        } else {
          console.error("No society ID found in token.");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  },[])
  // console.log('h',formik.values);

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
                <h3 className="card-title mb-3">Add House</h3>
                <div className="row">
                  {/* House Number */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="houseNo" className="form-label">
                      House Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control`}
                      id="houseNo"
                      name="houseNo"
                      value={formik.values.houseNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.houseNo && formik.errors.houseNo && (
                      <div className="text-danger">{formik.errors.houseNo}</div>
                    )}
                  </div>

                  {/* Block Number */}
                  <div className="col-md-6 mb-2">
                    <label htmlFor="blockNo" className="form-label">
                      Block Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control`}
                      id="blockNo"
                      name="blockNo"
                      value={formik.values.blockNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.blockNo && formik.errors.blockNo && (
                      <div className="text-danger">{formik.errors.blockNo}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                  <div className="col-md-8">
                    <button type="submit" className="btn btn-primary mt-3">
                      Add House
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
};

export default AddHouse;
