import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { PORT } from "../../port/Port";
import { jwtDecode } from "jwt-decode";
import { swal } from "sweetalert2/dist/sweetalert2";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  Box,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BackButton from "../utils/BackButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: 800,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  transition: "all 0.3s ease-in-out", // Smooth transition for opening/closing
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const closeModalButtonStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  color: "#333",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
};

const previewStyle = {
  width: "100%",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out", // Add smooth animation to scale images
};

const removeButtonStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  color: "white",
  backgroundColor: "rgba(255, 0, 0, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.9)",
  },
};

function EditSociety() {
  const decode = jwtDecode(localStorage.getItem("token"));
  const [societyData, setSocietyData] = useState(null);
  const location = useLocation();
  const id = location.state;
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [logo,setLogo]=useState()
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMediaChange = (e) => {
    // Ensure you are storing the actual file, not just a URL or object
    const files = Array.from(e.target.files);
  
    // Set the selected file to the logo state
    setLogo(files[0]);
  
    // You can still keep the preview URL if you need it for showing the preview
    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
  
    setMedia((prevMedia) => prevMedia.concat(filePreviews));
    e.target.value = ""; // Reset input after selecting files
  }; 

  const handleRemoveMedia = (index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  const customButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 11px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "inline-block",
    textAlign: "center",
    width: "95%",
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      state: "",
      city: "",
      contact: "",
      houseCount: "",
      registrationNumber: "",
      societyLogo: null,
      createdBy: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Society Name is required"),
      address: Yup.string().required("Address is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      contact: Yup.string()
        .required("Contact No. is required")
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),
      //   registrationNumber: Yup.string().required("registrationNumber No. is required"),
      //   societyLogo: Yup.mixed().required("Society Logo is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const formData = new FormData();
    
        
      if (logo) {
        formData.append("societyLogo", logo);
      }

      // Append other form values
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "societyLogo") {
          formData.append(key, value);
        }
      });
      try {
        const url = `${PORT}editSociety/${id}`;

        const response = await axios.put(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        });
        console.log(response);

        if (response.status == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Society Data Updated successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/society");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
console.log('logo',logo);

  useEffect(() => {
    if (id) {
      axios
        .get(`${PORT}getSocietyBySocietyID/${id}`)
        .then((response) => {
          setSocietyData(response.data.response);
          // Update Formik values with the fetched data
          formik.setValues({
            name: response.data.response.name || "",
            address: response.data.response.address || "",
            state: response.data.response.state || "",
            city: response.data.response.city || "",
            contact: response.data.response.contact || "",
            houseCount: response.data.response.houseCount || "",
            registrationNumber: response.data.response.registrationNumber || "",
            societyLogo: null,
            createdBy: decode.id,
          });
        })
        .catch((error) => {
          console.error("Error fetching society data:", error);
        });
    }
  }, [id]);
  //   const [societyData, setSocietyData] = useState(null);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
          <div> <BackButton/></div>
            <div className="card p-4">
              <h3 className="card-title text-center">Edit Society Details</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="row">
                  {/* Society Name */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Society Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      //   value={societyData.name}
                      placeholder="Enter society name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-danger">{formik.errors.name}</div>
                    ) : null}
                  </div>

                  {/* Society Logo */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="societyLogo" className="form-label">
                      Society Logo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      id="societyLogo"
                      className="form-control"
                      style={{ display: "none" }}
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      //   onChange={(event) => {
                      //     formik.setFieldValue("societyLogo", event.currentTarget.files[0]);
                      //   }}
                    />
                    <div className="d-flex justify-content-between">
                      <label htmlFor="societyLogo" style={customButtonStyle}>
                        Choose File
                      </label>
                      <i className="mdi mdi-eye" onClick={handleOpen} />
                    </div>
                    <Modal open={open} onClose={handleClose}>
                      <Box sx={style}>
                        <IconButton
                          sx={closeModalButtonStyle}
                          onClick={handleClose}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Grid container spacing={2} mt={2}>
                          {media.map((item, index) => (
                            <Grid item xs={4} key={index}>
                              <Box position="relative">
                                {item.type.startsWith("image/") ? (
                                  <img
                                    src={item.url}
                                    alt={`Uploaded ${index + 1}`}
                                    style={{
                                      ...previewStyle,
                                      transform: "scale(1)",
                                    }}
                                    className="media-preview"
                                  />
                                ) : (
                                  <video
                                    src={item.url}
                                    controls
                                    style={previewStyle}
                                  />
                                )}
                                <IconButton
                                  onClick={() => handleRemoveMedia(index)}
                                  sx={removeButtonStyle}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Modal>
                  </div>

                  {/* Address */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="address" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder="Enter address"
                      {...formik.getFieldProps("address")}
                    />
                    {formik.touched.address && formik.errors.address ? (
                      <div className="text-danger">{formik.errors.address}</div>
                    ) : null}
                  </div>

                  {/* State */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      placeholder="Enter state"
                      {...formik.getFieldProps("state")}
                    />
                    {formik.touched.state && formik.errors.state ? (
                      <div className="text-danger">{formik.errors.state}</div>
                    ) : null}
                  </div>

                  {/* City */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder="Enter city"
                      {...formik.getFieldProps("city")}
                    />
                    {formik.touched.city && formik.errors.city ? (
                      <div className="text-danger">{formik.errors.city}</div>
                    ) : null}
                  </div>

                  {/* Contact No. */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="contact" className="form-label">
                      Contact No. <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact"
                      placeholder="Enter contact number"
                      {...formik.getFieldProps("contact")}
                    />
                    {formik.touched.contact && formik.errors.contact ? (
                      <div className="text-danger">{formik.errors.contact}</div>
                    ) : null}
                  </div>

                  {/* No. of Houses in Society */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="houses" className="form-label">
                      No. of Houses in Society
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="houseCount"
                      placeholder="Enter number of houses"
                      {...formik.getFieldProps("houseCount")}
                    />
                  </div>

                  {/* Society registrationNumber No. */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="registrationNumber" className="form-label">
                      Society Registration No.{" "}
                      <span className="text-danger"></span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="registrationNumber"
                      placeholder="Enter registrationNumber number"
                      //   {...formik.getFieldProps("registrationNumber")}
                    />
                    {/* {formik.touched.registrationNumber && formik.errors.registrationNumber ? (
                      <div className="text-danger">{formik.errors.registrationNumber}</div>
                    ) : null} */}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditSociety;
