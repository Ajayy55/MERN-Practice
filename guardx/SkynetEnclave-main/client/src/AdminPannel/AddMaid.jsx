import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { PORT } from "../Api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import Webcam from "react-webcam"; 
import "./form.css";
import { RxCross2 } from "react-icons/rx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  width: 800,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function AddMaid() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const id = localStorage.getItem("maidId");

  const validationSchema = Yup.object({
    houseMaidHindi: Yup.string().required("Maid Name in Hindi is required"),
    houseMaidEnglish: Yup.string().required("Maid Name in English is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    aadharNumber: Yup.string().required("Aadhar Number is required"),
    image: Yup.mixed().required("Image is required"), // Add validation for image field
  });

  const formik = useFormik({
    initialValues: {
      houseMaidHindi: "",
      houseMaidEnglish: "",
      gender: "",
      address: "",
      aadharNumber: "",
      image: null, // Initialize image field
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // For image upload, you can use FormData
        const formData = new FormData();
        formData.append("houseMaidHindi", values.houseMaidHindi);
        formData.append("houseMaidEnglish", values.houseMaidEnglish);
        formData.append("gender", values.gender);
        formData.append("address", values.address);
        formData.append("aadharNumber", values.aadharNumber);
        formData.append("image", values.image);

        await axios.put(`${PORT}/updateHouseMaid/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        handleClose(); 
        window.location.reload();
        console.log(formData);
      } catch (error) {
        console.error("Error updating entry:", error);
      }
    },
  });

  useEffect(() => {
    const getEntryData = async () => {
      try {
        const response = await axios.get(`${PORT}/updateHouseMaid/${id}`);
        if (response.data.data) {
          formik.setValues(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching entry data:", error);
      }
    };
    getEntryData();
  }, [id]);

  return (
    <div>
      <button className="add-btn" onClick={handleOpen}>
        Add Maid
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal_dropdown_housemaid"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className="button_cross">
              <Button onClick={handleClose} className="button_crossmaid">
                <RxCross2 className="cross_icon " />
              </Button>
            </div>
            <form onSubmit={formik.handleSubmit} className="house_maid_form">
              <div>
                <label className="editLabel" htmlFor="houseMaidHindi">
                  Maid Name in Hindi
                </label>
                <br />
                <input
                  type="text"
                  id="houseMaidHindi"
                  name="houseMaidHindi"
                  value={formik.values.houseMaidHindi}
                  onChange={formik.handleChange}
                  className="edit-input"
                />
                {formik.errors.houseMaidHindi && (
                  <div className="error">{formik.errors.houseMaidHindi}</div>
                )}
              </div>
              <div>
                <label className="editLabel" htmlFor="houseMaidEnglish">
                  Maid Name in English
                </label>
                <br />
                <input
                  type="text"
                  id="houseMaidEnglish"
                  name="houseMaidEnglish"
                  value={formik.values.houseMaidEnglish}
                  onChange={formik.handleChange}
                  className="edit-input"
                />
                {formik.errors.houseMaidEnglish && (
                  <div className="error">{formik.errors.houseMaidEnglish}</div>
                )}
              </div>

              <div>
                <label className="editLabel" htmlFor="address">
                  Address
                </label>
                <br />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className="edit-input"
                />
                {formik.errors.address && (
                  <div className="error">{formik.errors.address}</div>
                )}
              </div>
              <div>
                <label className="editLabel" htmlFor="aadharNumber">
                  Aadhar Number
                </label>
                <br />
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formik.values.aadharNumber}
                  onChange={formik.handleChange}
                  className="edit-input"
                />
                {formik.errors.aadharNumber && (
                  <div className="error">{formik.errors.aadharNumber}</div>
                )}
              </div>
              <div className="image_div">
                <label className="editLabel">Add Image</label>
                {/* <RiImageAddFill /> */}
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="webcam-style"
                  onCapture={(imageSrc) =>
                    formik.setFieldValue("image", imageSrc)
                  }
                />
                {formik.errors.image && (
                  <div className="error">{formik.errors.image}</div>
                )}
              </div>
              <div className="house_maid_gender">
                <label className="editLabel">Gender</label>
                <br />
                <label className="label_input_radio">
                  <input
                    type="radio"
                    id="genderMale"
                    name="gender"
                    value="Male"
                    checked={formik.values.gender === "Male"}
                    onChange={formik.handleChange}
                  />{" "}
                  Male
                </label>
                <label className="label_input_radio">
                  <input
                    type="radio"
                    id="genderFemale"
                    name="gender"
                    value="Female"
                    checked={formik.values.gender === "Female"}
                    onChange={formik.handleChange}
                  />{" "}
                  Female
                </label>
              </div>
              <br />
              {formik.errors.gender && (
                <div className="error">{formik.errors.gender}</div>
              )}

              <button className="edit-button" type="submit">
                Update
              </button>
            </form>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default AddMaid;
