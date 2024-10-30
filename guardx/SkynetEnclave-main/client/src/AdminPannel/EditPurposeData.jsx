import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { PORT } from "../Api/api";
import { MdOutlineModeEdit } from "react-icons/md";
import Swal from "sweetalert2";
import "./Purpose.css";
import { RxCross2 } from "react-icons/rx";
import ShowEditpurposeImage from "./ShowEditpurposeImage";
import AdminNavbar from "./AdminNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useRef } from "react";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const EditPurposeData = (item) => {
  const {language}=useContext(LanguageContext)
  const [open, setOpen] = useState(false);
  const [purposeIcon, setPurposeIcon] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setSelectedFile(null);
  };
  const validationSchema = Yup.object({
    purpose: Yup.string().required("Purpose is required"),
  });

  const params = useParams();
  const id = params.id;
  const formik = useFormik({
    initialValues: {
      purpose: "",
      hindiPurpose: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Are you sure you want to update this Purpose?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
        customClass: {
          container: "my-swal",
        },
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("purpose", values.purpose);
          if (selectedFile) {
            formData.append("purposeIcon", selectedFile);
          }
          const res = await axios.put(`${PORT}/updatePurpose/${id}`, formData);
          const updatedPurpose = await res.data.msg;
          toast.success(updatedPurpose);
          setTimeout(() => {
            navigate(-1);
            handleClose();
          }, 1000);
        } catch (error) {
          console.error("Error updating entry:", error);
        }

        setOpen(false);
      } else {
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    const getPurposeData = async () => {
      try {
        const response = await axios.get(`${PORT}/getUpdatePurpose/${id}`);
        formik.setValues(response.data.details);
        setPurposeIcon(response.data.details.purposeIcon);
      } catch (error) {
        console.log("Internal Server Error");
      }
    };
    getPurposeData();
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Check if the file is a video
    if (file && file.type.startsWith("video/")) {
      toast.error("Video files are not allowed!");
      fileInputRef.current.value = "";
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
          {language === "hindi" ? "Edit Purpose " : "उद्देश्य संपादित करें"}

          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="add_entry">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label className="editLabel" htmlFor="purpose">
               
                {language === "hindi" ? " Enter Purpose " : "उद्देश्य दर्ज करें "}
                
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                className="edit-input"
                maxLength={35}
              />

              {formik.errors.purpose && (
                <div className="error"> {formik.errors.purpose}</div>
              )}
            </div>

            <label className="editLabel" htmlFor="purposeIcon">
           
              {language === "hindi" ? "    Icon" : "आइकन "}
            </label>
            <br />
            <input
              type="file"
              id="purposeIcon"
              name="purposeIcon"
              onChange={handleFileChange}
              className="edit-input"
              // accept="image/*"
              ref={fileInputRef}
            />
            <h6>
              <ShowEditpurposeImage data={{purposeIcon:purposeIcon,purpose:formik.values.purpose}} />
            </h6>
            <div className="main_button_div">
            <button className="edit-button" type="submit">
             
              {language === "hindi" ? " Update" : "अद्यतन"}
            </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </Layout>
    </>
  );
};

export default EditPurposeData;
