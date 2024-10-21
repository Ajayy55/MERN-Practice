import React, { useState } from "react";
import Products from "./Products";
import Layout from "../../layouts/Layout";
import { Formik, useFormik } from "formik";
import { SignUpSchema } from "./../../schema";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { PORT } from "../../PORT/PORT";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoCaretBackSharp } from "react-icons/io5";

import {
  Button,
  Modal,
  Box,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  product: "",
  category: "",
  subCategory: "",
  price: "",
  stock: "",
  sku: "",
  desc: "",
  weight: "",
  discount: "",
  p_images: [],
};

function AddProducts() {
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewFiles, setpreviewFiles] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia((prevMedia) => prevMedia.concat(files));

    const Pfiles = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setpreviewFiles((prevMedia) => prevMedia.concat(Pfiles));
    e.target.value = ""; // Reset input
  };

  const handleRemoveMedia = (index) => {
    setpreviewFiles((prevMedia) => prevMedia.filter((_, i) => i !== index));
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  const navigate = useNavigate();

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      // validationSchema:SignUpSchema,
      onSubmit: async (values) => {
        try {
          const formData = new FormData();

          media.forEach((files) => {
            formData.append("files", files);
          });

          for (const key in values) {
            formData.append(key, values[key]);
          }
          console.log("formdata", formData);

          const url = `${PORT}addProduct`;
          const response = await axios.post(url, formData, {
            headers: {
              "content-Type": "multipart/form-data",
            },
          });
          console.log(response);

          if (response?.status === 201) {
            handleSuccess(response?.data?.message);
            setTimeout(() => {
              navigate("/products");
            }, 1000);
          }
        } catch (error) {
          console.log("error while Signup ", error);
          handleError(error?.response?.data.message);
        }
      },
    });
  return (
    <>
      <Layout>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-xl-10 col-lg-8 col-md-7 mx-auto">
              <div className="card z-index-0">
                <div
                  className="card-header text-center pt-4 align-middle"
                  style={{ display: "flex" }}
                >
                  <button
                    onClick={() => {
                      navigate("/products");
                    }}
                    className="btn btn-primary"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <IoCaretBackSharp />
                    Back
                  </button>
                  <h5 style={{ marginLeft: "35%" }}>Add product</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-12 col-lg-8 col-md-7 mx-auto">
                        <div className="mb-3">
                          <label htmlFor="name">Product Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Product Name"
                            aria-label="product"
                            name="product"
                            value={values.product}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            maxLength={40}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="name">Select category</label>
                      <select
                        className="form-control"
                        placeholder="Select Cateogry"
                        aria-label="category"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={40}
                      >
                        <option
                          name="electronic"
                          value={"Electronics"}
                          onChange={handleChange}
                          defaultValue
                        >
                          Electronics
                        </option>
                        <option
                          name="mens"
                          value={"Mens Fashion"}
                          onChange={handleChange}
                        >
                          Mens Fashion
                        </option>
                        <option
                          name="womens"
                          value={"Womens Fashion"}
                          onChange={handleChange}
                        >
                          Womens Fashion
                        </option>
                        <option
                          name="home"
                          value={"Home Decore"}
                          onChange={handleChange}
                        >
                          Home Decore
                        </option>
                        <option
                          name="kids"
                          value={"Kids"}
                          onChange={handleChange}
                        >
                          Kids
                        </option>
                        <option name="Others" value={"Others"}>
                          Others
                        </option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="name">Select Subcategory</label>
                      <select
                        className="form-control"
                        placeholder="Select Cateogry"
                        aria-label="subCategory"
                        name="subCategory"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={40}
                      >
                        <option name="Cloths" value={"Cloths"} defaultValue>
                          Mobiles
                        </option>
                        <option name="Shoes" value={"Shoes"}>
                          Shoes
                        </option>
                        <option name="mobiles" value={"mobiles"}>
                          Cloths
                        </option>
                        <option name="Televison" value={"Televison"}>
                          Televison
                        </option>
                        <option name="Laptop" value={"Laptop"}>
                          Laptop
                        </option>
                        <option name="Others" value={"Others"}>
                          Others
                        </option>
                      </select>
                      {errors.username && touched.username ? (
                        <span className="text-danger text-sm">
                          {errors.username}
                        </span>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <label>Price</label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Item Price"
                        aria-label="price"
                        name="price"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Weight (kg)</label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Item Weight"
                        aria-label="weight"
                        name="weight"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Stock </label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Item Stock"
                        aria-label="stock"
                        name="stock"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>SKU</label>{" "}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Item SKU"
                        aria-label="sku"
                        name="sku"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={40}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Discount </label>{" "}
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Discount if any"
                        aria-label="discount"
                        name="discount"
                        value={values.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        maxLength={3}
                      />
                    </div>

                    <div className="mb-3">
                      <label>Product Desription</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter Product Desription"
                        aria-label="Password"
                        rows={5}
                        name="desc"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={140}
                      />
                    </div>

                    <div
                      className="mb-3"
                      style={{
                        alignContent: "center",
                        display: "flex",
                      }}
                    >
                      <input
                        type="file"
                        className="form-control"
                        aria-label="files"
                        name="files"
                        onChange={handleMediaChange}
                        multiple
                      />
                      <span
                        variant="outlined"
                        onClick={handleOpen}
                        style={{
                          alignContent: "center",
                          marginLeft: "-30px",
                        }}
                      >
                        <FaEye />
                      </span>
                    </div>

                    <Modal open={open} onClose={handleClose}>
                      <Box sx={style}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          Uploaded Media
                        </Typography>

                        <Grid container spacing={2}>
                          {previewFiles.map((item, index) => (
                            <Grid item xs={4} key={index}>
                              <Box position="relative">
                                {item.type.startsWith("image/") ? (
                                  <img
                                    src={item.url}
                                    alt={`Uploaded ${index + 1}`}
                                    style={{
                                      width: "100px",
                                      height:"150px",
                                      borderRadius: "8px",
                                    }}
                                  />
                                ) : (
                                  <video
                                    src={item.url}
                                    controls
                                    style={{
                                      width: "100%",
                                      borderRadius: "8px",
                                    }}
                                  />
                                )}
                                <IconButton
                                  onClick={() => handleRemoveMedia(index)}
                                  style={{
                                    position: "absolute",
                                    top: -25,
                                    left: -20,
                                    margin: 0,
                                    color: "red",
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Modal>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn bg-gradient-dark w-100 my-4 mb-2"
                      >
                        Add Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
}

export default AddProducts;
