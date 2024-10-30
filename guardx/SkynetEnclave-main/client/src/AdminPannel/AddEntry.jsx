import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { PORT } from "../Api/api";
import "./form.css";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "./export-button.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const validationSchema = Yup.object({
  titleEnglish: Yup.string().required("Title is required"),

  entryType: Yup.string().required("Entry type is required"),
});

function AddEntry() {
  const { language } = useContext(LanguageContext);
  const { addItem, removeItem, updateItem } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [entryIcon, setEntryIcon] = useState();
  const fileInputRef = useRef(null);
  const default_level = JSON.parse(localStorage.getItem("role"))
  const handleClose = () => {
    getEntries();
    setOpen(false);
    formik.resetForm();
  };

  const getEntries = async () => {
    try {
      await axios.get(`${PORT}/getEntries`);
    } catch (error) {
      console.log(error);
    }
  };

  getEntries();

  const handleOpen = () => setOpen(true);
  const society_id = JSON.parse(localStorage.getItem("society_id"));
  const formik = useFormik({
    initialValues: {
      titleEnglish: "",
      icon: "",
      entryType: "",
      society_id: society_id || null,
      defaultPermissionLevel: default_level,
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Are you sure you want to add this Entry?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
        customClass: {
          container: "my-swal",
        },
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("titleEnglish", values.titleEnglish);
          formData.append("entryType", values.entryType);
          formData.append("society_id", society_id);
          formData.append("defaultPermissionLevel", default_level)
          
          if (entryIcon) {
            if (
              entryIcon.type === "image/jpeg" ||
              entryIcon.type === "image/png"
            ) {
              formData.append("icon", entryIcon);
            } else if (entryIcon.type === "video/mp4") {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please upload an image, not a video'",
                customClass: {
                  container: "my-swal",
                },
              });
              return;
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid file type. Please upload an image or video!",
              });
              return;
            }
          }

          await axios.post(`${PORT}/entries`, formData).then((res) => {
            addItem(res.data.details);
            getEntries();
            formik.resetForm();
            handleClose();
            toast.success("Your Entry Is added");
            navigate("/admin/entry-type");
          });
        } catch (error) {
          console.error("Error adding entry:", error.response.data.error);
          toast.error(error.response.data.error);
        }
      } else {
        toast.error("Your Entry is not Added");
        setOpen(false);
      }
    },
  });

  useEffect(() => {
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        setEntryIcon(e.target.files[0]);
      } else {
        toast.error("Please upload an image file");
        fileInputRef.current.value = "";
      }
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? "Add Entries" : " प्रविष्टियाँ जोड़ें "}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="add_entry">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label className="editLabel" htmlFor="titleEnglish">
                {language === "hindi"
                  ? "Enter Entries"
                  : "प्रविष्टियां दर्ज करें "}
                <span className="Star_color">*</span>
              </label>{" "}
              <br />
              <input
                type="text"
                id="titleEnglish"
                name="titleEnglish"
                value={formik.values.titleEnglish}
                onChange={formik.handleChange}
                className="edit-input"
                maxLength={30}
              />
              {formik.errors.titleEnglish && formik.touched.titleEnglish && (
                <div className="errors">{formik.errors.titleEnglish}</div>
              )}
            </div>
            <div>
              <label className="editLabel" htmlFor="icon">
                {language === "hindi" ? " Icon" : "आइकन "}
              </label>{" "}
              <br />
              <input
                type="file"
                // id="icon"
                name="icon"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="edit-input"
              />
            </div>
            <div className="entry_type_div_radio">
              <label className="editLabel1">
                {language === "hindi" ? "  Entry Type" : "प्रवेश प्रकार  "}
                <span className="Star_color">*</span>
              </label>
              <div className="entry_type_radio">
                <div className="add-entry-radio-button">
                <label>
                  <input
                    type="radio"
                    value="Regular"
                    name="entryType"
                    checked={formik.values.entryType === "Regular"}
                    onChange={formik.handleChange}
                    className="radio_input"
                  />

                  {language === "hindi" ? " Regular" : "नियमित  "}
                </label>
                </div>
                <div>
                <label>
                  <input
                    type="radio"
                    name="entryType"
                    value="Occasional"
                    checked={formik.values.entryType === "Occasional"}
                    onChange={formik.handleChange}
                    className="radio_input"
                  />

                  {language === "hindi" ? "  Occasional" : "प्रासंगिक "}
                </label>
                </div>
                
              </div>
              {formik.errors.entryType && formik.touched.entryType && (
                <div className="errorss_entry">{formik.errors.entryType}</div>
              )}
            </div>
            <div className="main_button_div">
              <button className="edit-button" type="submit">
                {language === "hindi" ? "Add" : " प्रविष्टियाँ"}
              </button>
            </div>
          </form>
        </div>

        <ToastContainer />
      </Layout>
    </>
  );
}

export default AddEntry;
