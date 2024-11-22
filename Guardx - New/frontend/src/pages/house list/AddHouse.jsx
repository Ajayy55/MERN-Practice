import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Layout from "../../layout/Layout";
import BackButton from "../utils/BackButton";

const AddHouse = () => {
  // Formik with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      houseNo: "",
      blockNo: "",
    },
    validationSchema: Yup.object({
      houseNo: Yup.string()
        .required("House Number is required")
        .matches(/^[A-Za-z0-9]+$/, "Invalid characters in House Number"),
      blockNo: Yup.string()
        .required("Block Number is required")
        .matches(/^[A-Za-z0-9]+$/, "Invalid characters in Block Number"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values);
      // Add your submission logic here
    },
  });

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
