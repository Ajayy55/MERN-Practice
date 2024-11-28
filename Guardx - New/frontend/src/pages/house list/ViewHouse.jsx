import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  Box,
  Button,
  Slide,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../utils/BackButton";
import ImagePreview from "../utils/ImagePreview";
import { PORT } from "../../port/Port";
import axios from "axios";
import { usePermissions } from "../../context/PermissionsContext";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index}>
          <Box p={3}>
            <Typography variant="body1">{children}</Typography>
          </Box>
        </Fade>
      )}
    </div>
  );
}

const GradientTabs = styled(Tabs)({
  background: "linear-gradient(90deg, #ff8c00, #ff2e63, #6c63ff)",
  borderRadius: "10px",
  color: "#fff",
  padding: "5px",
  "& .MuiTab-root": {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    textTransform: "capitalize",
    margin: "0 10px",
    borderRadius: "20px",
    padding: "10px 20px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
  "& .Mui-selected": {
    backgroundColor: "#fff",
    color: "#ff2e63",
    fontWeight: "bold",
  },
});

const StyledTabPanel = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: "12px",
  backgroundColor: "#000000",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
  animation: "fadeIn 0.5s ease",
}));

function ViewHouse() {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const house = location.state;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const closePanel = () => {
    setOpen(false);
    navigate(-1);
  };

  return (
    <>
      <Layout>
        <div className="content-wrapper">
          {/* <BackButton/ > */}
          <Box>
            {/* Sliding Component */}
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
              <Box sx={{ width: "100%", padding: { xs: "0px", sm: "0px" } }}>
                <IconButton
                  onClick={closePanel}
                  color="primary"
                  sx={{ float: "right" }}
                >
                  <CloseIcon />
                </IconButton>
                <GradientTabs value={value} onChange={handleChange}>
                  <Tab label="House Details" />
                  <Tab label="Vehicle Details" />
                  {/* <Tab label="Settings" /> */}
                </GradientTabs>

                {/* Tab Panels */}
                <StyledTabPanel>
                  <TabPanel value={value} index={0}>
                    <Typography variant="h4" color="#1976d2" gutterBottom>
                      Owner Details
                    </Typography>
                    <Typography variant="body1">
                      <Profile house={house} /> 
                    </Typography>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Typography variant="h4" color="#ff2e63" gutterBottom>
                      Vehicles Details
                    </Typography>
                    <Typography variant="body1">
                        <Vehicles house={house}/>
                    </Typography>
                  </TabPanel>
                  {/* <TabPanel value={value} index={2}>
                    <Typography variant="h4" color="#6c63ff" gutterBottom>
                      Settings
                    </Typography>
                    <Typography variant="body1">
                      Customize your application settings and preferences here.
                    </Typography>
                  </TabPanel> */}
                </StyledTabPanel>
              </Box>
            </Slide>

            {/* Button to Reopen the Panel */}
            {!open && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
                sx={{ position: "fixed", bottom: 20, right: 20 }}
              >
                Open Panel
              </Button>
            )}
          </Box>
        </div>
      </Layout>
    </>
  );
}

export default ViewHouse;

function Profile({ house }) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const navigate=useNavigate();
  const formattedAadhar = house.aadhaarNumber?`${house.aadhaarNumber?.slice(0,4)}-${house.aadhaarNumber?.slice(4, 8)}-${house.aadhaarNumber?.slice(8-12)}`:null;
  // Validation Schema using Yup
  const validationSchema = Yup.object({
    ownerName: Yup.string()
      .required("Owner name is required")
      .min(3, "Name must be at least 3 characters"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Must be a valid 10-digit mobile number"),
    houseNo: Yup.string().required("House No. is required"),
    blockNo: Yup.string().required("Block No. is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    aadhaarNumber: Yup.string()
      .required("Aadhar Number is required")
      .matches(/^\d{4}-\d{4}-\d{4}$/, "Must match the format xxxx-xxxx-xxxx"),
    aadhaarImage: Yup.mixed().required("Aadhar image is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      ownerName: house.ownerName || "",
      mobile: house.mobile || "",
      houseNo: house.houseNo || "",
      blockNo: house.blockNo || "",
      email: house.email || "",
      aadhaarNumber: formattedAadhar || "",
      aadhaarImage: house.aadhaarImage || null,
      ownerImage: house.ownerImage || null,
      isRwaMember: house.isRwaMember || false,
    },
    validationSchema,
    onSubmit: async(values) => {
      // console.log("Form Values:", values);
      values.aadhaarNumber=values.aadhaarNumber.replace(/-/g, "")
      const payload={
        ...values,
        houseId:house._id,
        updatedBy:localStorage.getItem('user')
      }

      try {
        const url=`${PORT}editHouse`;
        const response=await axios.patch(url,payload,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        // console.log('inside if');
        // console.log(response);
        if(response.status===200){
          Swal.fire({
            position: "center",
            icon: "success",
            title: response?.data.message || " House Updated Succesfully",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/houseList");
          }, 1000);
        }

      } catch (error) {
       console.log(error);
       Swal.fire("Error",  error?.response?.data?.message || "Error Occured Updating House Owner!", "error");
      }

    },
  });

  // console.log("sss", formik.errors);

  return (
    <>
      <div className="row">
        <div className="col-xl-3">
          {/* Profile picture card */}
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              {/* Profile picture image */}
              <img
                className="img-account-profile rounded-circle mb-2"
                src={house?.ownerImage ?`${PORT}${house?.ownerImage?.split("public")[1]}`:"http://bootdey.com/img/Content/avatar/avatar1.png"}
                alt=""
                style={{ height: "200px", width: "200px" }}
              />
              <div className="small font-italic text-muted mb-4"></div>

              {/* <button className="btn btn-primary" type="button"> */}
              <input
                type="file"
                className="form-control"
                id="ownerImage"
                name="ownerImage"
                style={{ display: "none" }}
                onChange={(event) => {
                  formik.setFieldValue("ownerImage", event.target.files[0]);
                 
                }}
              />
              <label htmlFor="ownerImage" className="btn btn-primary">
                Change Profile Picture
              </label>
              {/* </button> */}
            </div>
          </div>
        </div>
        <div className="col-xl-9">
          {/* Account details card */}
          <div className="card mb-4">
            <div className="card-header">House Owner Details</div>
            <div className="card-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="row gx-3 mb-3">
                  {/* Owner name */}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="ownerName">
                      Owner Name
                    </label>
                    <input
                      className={`form-control ${
                        formik.errors.ownerName && formik.touched.ownerName
                          ? "is-invalid"
                          : ""
                      }`}
                      id="ownerName"
                      type="text"
                      {...formik.getFieldProps("ownerName")}
                    />
                    {formik.touched.ownerName && formik.errors.ownerName && (
                      <div className="invalid-feedback">
                        {formik.errors.ownerName}
                      </div>
                    )}
                  </div>
                  {/* Mobile */}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="mobile">
                      Mobile
                    </label>
                    <input
                      className={`form-control ${
                        formik.errors.mobile && formik.touched.mobile
                          ? "is-invalid"
                          : ""
                      }`}
                      id="mobile"
                      type="text"
                      {...formik.getFieldProps("mobile")}
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <div className="invalid-feedback">
                        {formik.errors.mobile}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  {/* House No */}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="houseNo">
                      House No.
                    </label>
                    <input
                      className={`form-control ${
                        formik.errors.houseNo && formik.touched.houseNo
                          ? "is-invalid"
                          : ""
                      }`}
                      id="houseNo"
                      type="text"
                      {...formik.getFieldProps("houseNo")}
                    />
                    {formik.touched.houseNo && formik.errors.houseNo && (
                      <div className="invalid-feedback">
                        {formik.errors.houseNo}
                      </div>
                    )}
                  </div>
                  {/* Block No */}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="blockNo">
                      Block No.
                    </label>
                    <input
                      className={`form-control ${
                        formik.errors.blockNo && formik.touched.blockNo
                          ? "is-invalid"
                          : ""
                      }`}
                      id="blockNo"
                      type="text"
                      {...formik.getFieldProps("blockNo")}
                    />
                    {formik.touched.blockNo && formik.errors.blockNo && (
                      <div className="invalid-feedback">
                        {formik.errors.blockNo}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  {/* Email */}
                  <label className="small mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className={`form-control ${
                      formik.errors.email && formik.touched.email
                        ? "is-invalid"
                        : ""
                    }`}
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                <div className="row gx-3 mb-3">
                  {/* Aadhaar Number */}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="aadhaarNumber">
                      Aadhaar Number
                    </label>
                    <input
                      className={`form-control ${
                        formik.errors.aadhaarNumber &&
                        formik.touched.aadhaarNumber
                          ? "is-invalid"
                          : ""
                      }`}
                      id="aadhaarNumber"
                      type="text"
                      {...formik.getFieldProps("aadhaarNumber")}
                    />
                    {formik.touched.aadhaarNumber &&
                      formik.errors.aadhaarNumber && (
                        <div className="invalid-feedback">
                          {formik.errors.aadhaarNumber}
                        </div>
                      )}
                  </div>
                  {/* Aadhaar Image */}
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="aadhaarImage">
                      Aadhaar Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="aadhaarImage"
                      name="aadhaarImage"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "aadhaarImage",
                          event.target.files[0]
                        );
                        const file = event.currentTarget.files[0];
                        setSelectedFileName(file ? file.name : "");
                      }}
                    />
                    <label htmlFor="aadhaarImage" style={customButtonStyle}>
                      Choose File
                    </label>
                    <span
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                       {!previewImage ?
                      <i
                        className="mdi mdi-eye"
                        onClick={() => setPreviewImage(house.aadhaarImage)}
                      />
                    :
                      <i
                        className="mdi mdi-eye-off"
                        onClick={() => setPreviewImage(null)}
                      />
                    }
                      </span>

                    {selectedFileName && <p>{selectedFileName}</p>}
                    {formik.errors.aadhaarImage && (
                      <div className="text-danger">
                        {formik.errors.aadhaarImage}
                      </div>
                    )}
                   
              
                  </div>
                </div>
                {/* RWA Member */}
                <div className="col-md-12 ">
                <div className="mb-3 d-flex justify-content-between ">
                    <div>
                  <label htmlFor="isRwaMember" className="me-2">
                    RWA Member?
                  </label>
                  <input
                    type="checkbox"
                    id="isRwaMember"
                    checked={formik.values.isRwaMember ? true : false}
                    {...formik.getFieldProps("isRwaMember")}
                  
                  /></div>
                </div>
                </div>

                  <div className="col-md-12 d-flex justify-content-between">
                    <div className="col-md-6">
                  <button className="btn btn-primary " type="submit">
                    Save Changes
                  </button>
                    </div>
                  {previewImage && (
                    <div className="">
                      <ImagePreview
                        image={previewImage}
                        onClose={() => setPreviewImage(null)} // Optional: Close logic
                      />
                    </div>
                  )}
                </div>


              </form>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


///add vehicles
function Vehicles({house}) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    vehicleType: Yup.string().required("Vehicle type is required"),
    vehicleNumber: Yup.string().required("Vehicle number is required")
    .matches(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, "Must match the format AB12XY1234"),
    vehicleImage: Yup.mixed().required("Vehicle image is required")
  });

  const handleSubmit = async(values) => {
     // You can handle the form data here.
     const payload = {
        ...house, 
       ...values, 
      houseId: house._id,
      updatedBy: localStorage.getItem('user'), // Current user
    };
    // console.log('payload',payload);
    try {
      const url=`${PORT}editHouse`;
      const response=await axios.patch(url,payload,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      // console.log('inside if');
      // console.log(response);
      if(response.status===200){
        Swal.fire({
          position: "center",
          icon: "success",
          title: response?.data.message || " House Updated Succesfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate("/houseList");
        }, 1000);
      }

    } catch (error) {
     console.log(error);
     Swal.fire("Error",  error?.response?.data?.message || "Error Occured Updating House Owner!", "error");
    }
  };
  const handleDelete = async (houseId,vehicleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.patch(`${PORT}removeHouseVehicle/`,{houseId,vehicleId}).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: response?.data?.message || "House removed successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              setTimeout(() => {
                navigate("/houseList");
              }, 1000);  
            } 
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error", "removing house Failed ..!!", "error");

        }
      }
    });
  }; 
  const { hasPermission } = usePermissions();
  // console.log("house", house);


  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          {/* Account details card */}
          <div className="card mb-4 text-center">
            <div className="card-header">Add Vehicle</div>
            <div className="card-body">
              <Formik
                initialValues={{
                  vehicleType: '',
                  vehicleNumber: '',
                  vehicleImage: null
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <div className="row gx-3 mb-3">
                      {/* Owner name */}
                      <div className="col-md-6">
                        <label className="small mb-1 d-flex" htmlFor="vehicleType">
                          Vehicle Type<span className="text-danger">*</span>
                        </label>
                        <Field as="select" name="vehicleType" className="form-control">
                          <option label="Choose Vehicle Type" value=""></option>
                          <option value="Two Wheeler">Two Wheeler</option>
                          <option value="Four Wheeler">Four Wheeler</option>
                        </Field>
                        <ErrorMessage name="vehicleType" component="div" className="text-danger" />
                      </div>

                      {/* Vehicle Number */}
                      <div className="col-md-6">
                        <label className="small mb-1 d-flex" htmlFor="vehicleNumber">
                          Vehicle Number <span className="text-danger">*</span>
                        </label>
                        <Field
                          id="vehicleNumber"
                          type="text"
                          name="vehicleNumber"
                          className="form-control"
                        />
                        <ErrorMessage name="vehicleNumber" component="div" className="text-danger" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="small mb-1 d-flex" htmlFor="vehicleImage">
                        Vehicle Image
                      </label>
                      <input
                        type="file"
                        id="vehicleImage"
                        name="vehicleImage"
                        style={{ display: "none" }}
                        onChange={(event) => setFieldValue("vehicleImage", event.currentTarget.files[0])}
                      />
                      <label htmlFor="vehicleImage" className="mb-4" style={customButtonStyle}>
                        Choose File
                      </label>
                      <ErrorMessage name="vehicleImage" component="div" className="text-danger" />
                    </div>

                    <button className="btn btn-primary d-flex " type="submit">
                      Save Vehicle
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
            
          <div className="table-responsive">
          <div className="d-flex justify-content-center">
          
          <span className="text-center fs-4 fw-bold text-capitalize text-light"> vehicle's List</span>
        </div>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Vehicle</th>
                        <th>Vehicle Number</th>
                        <th>Vehicle Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {house?.vehicles.length> 0 && house?.vehicles.map((vehicle) => {
                       return <tr key={vehicle._id}>
                          <td className="py-1 text-capitalize">
                            <img
                              src="../../assets/images/faces-clipart/pic-1.png"
                              alt="user avatar"
                              className="me-2"
                            />
                       
                          </td>
                          <td>{vehicle.vehicleNumber}</td>
                          <td>
                            {vehicle.vehicleType }
                          </td>
                          <td>
                            <div>
                              {/* {hasPermission("Users", "Edit") && (
                                <i
                                  className="mdi mdi-lead-pencil pe-3"
                                  data-bs-toggle="tooltip"
                                  title="Edit"
                                  onClick={() => handleEdit(user._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )} */}
                              {hasPermission("House List", "Delete") && (
                                <i
                                  className="mdi mdi-delete"
                                  data-bs-toggle="tooltip"
                                  title="Delete"
                                  onClick={() => handleDelete(house._id,vehicle._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      })}
                      {house?.vehicles.length <= 0 &&  (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>  

    </>
  );
}

