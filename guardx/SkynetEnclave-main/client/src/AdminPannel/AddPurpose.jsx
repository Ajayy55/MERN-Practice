import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { PORT } from "../Api/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "./Purpose.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const AddPurpose = (item) => {
  const [open, setOpen] = useState(false);
  const [purposeIcon, setPurposeIcon] = useState();
  const fileInputRef = useRef(null);
  const validationSchema = Yup.object({
    // purpose: Yup.string().required("Purpose is required"),
    // createdBy: Yup.string().required("Purpose Type is required"),
  });
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const default_level = JSON.parse(localStorage.getItem("role"));
  const { language } = useContext(LanguageContext);
  // Initialize Formik form
  const formik = useFormik({
    initialValues: {
      hindiPurpose: "",
      purpose: "",
      createdBy: "",
      society_id: society_id,
      defaultPermissionLevel: default_level,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Are you sure you want to add this Purpose?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add it!",
        customClass: {
          container: "my-swal",
        },
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("purpose", values.purpose);
          formData.append("hindiPurpose", values.hindiPurpose);
          formData.append("society_id", society_id);
          console.log(values.createdBy.id, values.createdBy.entry);
          formData.append("createdBy", values.createdBy);
          formData.append("linkedEntry", values.linkedEntry);
          formData.append("defaultPermissionLevel", default_level);
          if (purposeIcon) {
            if (
              purposeIcon.type === "image/jpeg" ||
              purposeIcon.type === "image/png"
            ) {
              formData.append("purposeIcon", purposeIcon);
            } else if (purposeIcon.type === "video/mp4") {
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
              return;
            }
          }

          await axios
            .post(`${PORT}/nonVerifiedPurpose`, formData)
            .then((res) => {
              formik.values.hindiPurpose = "";
              formik.values.purpose = "";
              setPurposeIcon("");
              setOpen(false);
              navigate("/admin/purpose-type");
            });
        } catch (error) {
          console.error("Error updating entry:", error);
        }

        setOpen(false);
      } else {
        setOpen(false);
        formik.values.hindiPurpose = "";
        formik.values.purpose = "";
        formik.values.createdBy = "";
      }
    },
  });
  const handlePurposeIcon = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        setPurposeIcon(e.target.files[0]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please upload an image file",
          customClass: {
            container: "my-swal",
          },
        });
        fileInputRef.current.value = "";
      }
    }
  };
  const navigate = useNavigate();
  //Get Entries Data
  const [purposeEntries, setPurposeEntries] = useState([]);
  const getEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const filterData = response.data.data;
      const filterData_with_defaultPermissionLevel = filterData
        ?.filter(
          (item) =>
            item?.defaultPermissionLevel === "1" ||
            item?.defaultPermissionLevel === "2"
        )
        .filter((item) => item.entryType === "Occasional");
      setPurposeEntries(filterData_with_defaultPermissionLevel);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEntries();
  }, []);
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">Add Purpose</h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className=" add_entry">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label className="editLabel" htmlFor="titleEnglish">
                {language === "hindi"
                  ? "  Enter Purpose  "
                  : "उद्देश्य दर्ज करें"}
                <span className="important_field">*</span>
              </label>
              <br />
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                className="edit-input"
                required
              />
            </div>
            <div>
              <label className="editLabel" htmlFor="titleEnglish">
                {language === "hindi"
                  ? "  Select Purpose Type   "
                  : "उद्देश्य प्रकार चुनें"}{" "}
                <span className="important_field">*</span>
              </label>
              <br />
              {/* <select
                name="createdBy"
                value={JSON.stringify(formik.values.createdBy)}
                onChange={(e) => {
                  formik.setFieldValue("createdBy", JSON.parse(e.target.value)); // Parse back into an object
                }}
                className="dropdown_select_purpose"
              >
                <option value="" disabled className="dropdown_option_purpose">
                {language === "hindi"
                  ? "  Select Purpose Type   "
                  : "उद्देश्य प्रकार चुनें"}
                </option>
                {purposeEntries.map((item) => (
                  <option key={item._id}  value={JSON.stringify({ id: item._id, entry: item.titleEnglish })}>
                    {item.titleEnglish}
                  </option>
                ))}
              </select> */}
              <select
                required
                name="createdBy"
                value={formik.values.createdBy} 
                onChange={(e) => {
                  const selectedPurpose = purposeEntries.find(
                    (item) => item._id === e.target.value
                  );
                  formik.setFieldValue("createdBy", selectedPurpose._id); 

                  formik.setFieldValue(
                    "linkedEntry",
                    selectedPurpose.titleEnglish
                  ); 
                }}
                className="dropdown_select_purpose"
              >
                <option value="" disabled className="dropdown_option_purpose">
                  {language === "hindi"
                    ? "Select Purpose Type"
                    : "उद्देश्य प्रकार चुनें "}
                </option>
                {purposeEntries.map((item) => (
                  <option key={item._id} value={item._id}>
                    {" "}
                    {/* Store the ID only */}
                    {item.titleEnglish}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="editLabel" htmlFor="titleHindi">
                {language === "hindi" ? "  Add Icon    " : "आइकन जोड़ें"}
              </label>
              <br />
              <input
                type="file"
                name="hindiPurpose"
                ref={fileInputRef}
                onChange={handlePurposeIcon}
                autoComplete="off"
                className="edit-input"
              />
            </div>

            <div className="main_button_div">
              <button className="edit-button" type="submit">
                Add
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </Layout>
    </>
  );
};

export default AddPurpose;
