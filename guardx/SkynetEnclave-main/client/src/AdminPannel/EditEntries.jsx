import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { PORT } from "../Api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./form.css";
import { MdOutlineModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import ShowEditEntryImage from "./ShowEditEntryImage";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { IoMdArrowBack } from "react-icons/io";
import { useRef } from "react";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { DataContext } from "../lib/DataContext";
import { useContext } from "react";
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

function EditEntries() {
  const {language}=useContext(LanguageContext)
  const { addItem, removeItem, updateItem } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const fileInputRef = useRef(null);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    formik.setValues("");
  };
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const validationSchema = Yup.object({
    titleEnglish: Yup.string().required("Title is required"),
    entryType: Yup.string().required("Entry type is required"),
  });

  const formik = useFormik({
    initialValues: {
      titleEnglish: "",
      titleHindi: "",
      icon: null,
      entryType: "regular",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("titleEnglish", values.titleEnglish);
        formData.append("entryType", values.entryType);
        formData.append("icon", values.icon);
        const res = await axios.put(`${PORT}/editEntry/${id}`, formData);
        const updatedItem = res.data.details;
        
        // Update the context
        updateItem(updatedItem);
        const updatedPurpose = await res.data.msg;

        toast.success(updatedPurpose);
        setTimeout(() => {
          navigate("/admin/entry-type");
          handleClose();
        }, 1000);
      } catch (error) {
        console.error("Error updating entry:", error);
      }
    },
  });
  const [getEditImage, setGetEditImage] = useState("");
  useEffect(() => {
    const getEntryData = async () => {
      try {
        const response = await axios.get(`${PORT}/editEntry/${id}`);
        if (response.data.details) {
          console.log(response.data.details,"response.data.details")
          formik.setValues(response.data.details);
          setGetEditImage(response.data.details.icon);
        }
      } catch (error) {
        console.error("Error fetching entry data:", error);
      }
    };
    getEntryData();
  }, [id]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        formik.setFieldValue("icon", e.target.files[0]);
      } else {
        toast.error("Please upload an image file");
        fileInputRef.current.value = "";
      }
    }
  };
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">

          {language === "hindi" ? "Edit Entries" : "प्रविष्टियाँ संपादित करें"}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="  add_entry ">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label className="editLabel" htmlFor="titleEnglish">
               
                {language === "hindi" ? "Entry" : "प्रवेश  "}
                 <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="titleEnglish"
                name="titleEnglish"
                maxLength={50}
                value={formik.values.titleEnglish}
                onChange={formik.handleChange}
                className="edit-input"
              />
              {formik.errors.titleEnglish && (
                <div className="error">{formik.errors.titleEnglish}</div>
              )}
            </div>

            <div>
              <label className="editLabel" htmlFor="icon">
               
                {language === "hindi" ? " Icon" : "आइकन "}
                
              </label>
              <br />
              <input
                type="file"
                id="icon"
                name="icon"
                onChange={handleFileChange}
                className="edit-input"
                ref={fileInputRef}
              />
              <h6>
                <ShowEditEntryImage
                  data={{
                    getEditImage: getEditImage,
                    entry: formik.values.titleEnglish,
                  }}
                />
              </h6>
              {/* {formik.errors.icon && <div>{formik.errors.icon}</div>} */}
            </div>
            <div className="">
              <label className="editLabel">
              {language === "hindi" ? " Entry Type" : "प्रवेश प्रकार"}
                </label> <br />
              <label>
                <input
                  type="radio"
                  name="entryType"
                  value="Regular"
                  checked={formik.values.entryType === "Regular"}
                  onChange={formik.handleChange}
                  className="radio_input"
                />
                
                {language === "hindi" ? "Regular" : "नियमित "}
              </label>
              <label>
                <input
                  type="radio"
                  name="entryType"
                  value="Occasional"
                  checked={formik.values.entryType === "Occasional"}
                  onChange={formik.handleChange}
                  className="radio_input"
                />
               
                {language === "hindi" ? "Occasional" : "प्रासंगिक "}
              </label>
            </div>
            <div className="edit_button_div">
              <button className="edit-button" type="submit">
              
                {language === "hindi" ? "Update" : " अद्यतन "}
                
              </button>
            </div>
          </form>
        </div>

        <ToastContainer />
      </Layout>
    </>
  );
}

export default EditEntries;
