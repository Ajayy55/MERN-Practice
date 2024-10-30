import React from "react";
import { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { PORT } from "../Api/api";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import "./verifyentry.css";
import "./request.css";
import Webcam from "react-webcam";
import { useRef } from "react";
import userPhoto from "./Images/avatar-1577909_1280.webp";
import Swal from "sweetalert2";
import "./maid.css";
import "./addregular.css";
import { IoEyeSharp } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "../css2/all.css";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import RegularView from "./handleViewImages/RegularView";
import { RxCross2 } from "react-icons/rx";
import "../AdminPannel/handleViewImages/view.css";
import { LanguageContext } from "../lib/LanguageContext";
import { useContext } from "react";
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

const AddRegularEntries = () => {
  const { language } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const [clickValue, setClickValue] = useState("Click a Photo");
  const [clickValueAdhar, setClickValueAdhar] = useState(false);
  const [clickImageAadhar, setClickImageAadhar] = useState(false);
  const [clickAadharvalue, setClickAadharValue] = useState("Click a Photo");
  const [maidName, setMaidName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const webcamRef = useRef(null);
  const webcamRefAadhar = useRef(null);
  const [imgSrc, setImgSrc] = useState(userPhoto);
  const [imgSrcAadhar, setImgSrcAadhar] = useState(userPhoto);
  const [imageAadharStore, setImageAadharStore] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageStore, setImageStore] = useState([]);
  const [imageBlobObject, setImageBlobObject] = useState([]);
  const [imageAadharBlobObject, setImageAadharBlobObject] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const id = localStorage.getItem("maidId");
  const [filesImage, setImageFiles] = useState([]);
  const [filesAadharImage, setAadharImageFiles] = useState([]);
  const [filesOptionalImage, setOptionalImageFiles] = useState([]);
  const [error, setError] = useState(true);
  const [aadharError, setAadharError] = useState(true);
  const fileInputRefImage = useRef(null);
  const fileInputRefAadhaarImage = useRef(null);
  const fileInputRefOptionlaImage = useRef(null);
  const paramsid = useParams();
  const perPage = 5;

  const getMaid = async () => {
    try {
      const url = `${PORT}/getVerifieUser/${paramsid.id}`;
      const response = await axios.get(url);
      if (response.data && response.data.verifyHouseMaid) {
        setMaidName(response.data.verifyHouseMaid);
        const totalItems = response.data.verifyHouseMaid.length;
        setTotalPages(Math.ceil(totalItems / perPage));
      } else {
        console.log("VerifyHouseMaid data not found in response.");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getMaid();
  }, [currentPage, perPage, paramsid.id]);

  const formik = useFormik({
    initialValues: {
      // houseMaidHindi: "",
      houseMaidEnglish: "",
      gender: "",
      address: "",
      aadharNumber: "",
      paramsId: paramsid.id,
    },
    validationSchema: Yup.object().shape({
      houseMaidEnglish: Yup.string().required("Name  is required"),

      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      aadharNumber: Yup.string()
        .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, "Invalid Aadhaar Number")
        .max(12, "Aadhaar Number must be exactly 12 digits")
        .required("Aadhaar Number is required"),
    }),
    onSubmit: async (values) => {
      if (!filesImage || filesImage.length === 0) {
        setError(true);
        return;
      } else if (!filesAadharImage || filesAadharImage.length === 0) {
        setAadharError(true);
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure you want to Add this Entry?",
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

          // Append non-image values to formData
          for (let key in values) {
            if (key !== "image" && key !== "aadharImage") {
              formData.append(key, values[key]);
            }
          }

          let hasMp4File = false; // Flag to track if mp4 file is found

          if (filesImage) {
            Object.values(filesImage).forEach((file) => {
              if (file.type.includes("image")) {
                formData.append("image", file);
              } else if (file.type.includes("video/mp4")) {
                toast.error("Only Image files are allowed for Image field");

                hasMp4File = true; // Set flag if mp4 file is found
              }
            });

            Object.values(filesAadharImage).forEach((file) => {
              if (file.type.includes("image")) {
                formData.append("aadharImage", file);
              } else if (file.type.includes("video/mp4")) {
                // console.error('Only Image files are allowed for "aadharImage" field');
                toast.error(
                  "Only Image files are allowed for Aadhaar Image field"
                );

                hasMp4File = true; // Set flag if mp4 file is found
              }
            });

            Object.values(filesOptionalImage).forEach((file) => {
              if (file.type.includes("image")) {
                formData.append("optionalImage", file);
              } else if (file.type.includes("video/mp4")) {
                console.error(
                  'Only Image files are allowed for "optionalImage" field'
                );
                toast.error(
                  "Only image files are allowed for Optional Image field"
                );

                hasMp4File = true; // Set flag if mp4 file is found
              }
            });

            // Check if mp4 file was found in any field
            if (!hasMp4File) {
              const response = await axios.post(
                `${PORT}/verifieduser`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              toast.success(response.data.msg);
              setImgSrc(null);
              handleClose();
              getMaid();
              formik.resetForm();
              setTimeout(() => {
                navigate(-1);
              }, 1000);
            }
          } else {
            console.error("No image files were added");
          }
        } catch (error) {
          console.error("Error submitting form:", error.response.data.error);
          toast.error(error.response.data.error);
        }
      }
    },
  });
  const redirectBackPage = () => {
    navigate(-1);
  };
  const handleClose = () => {
    setOpen(false);
    setImgSrc(userPhoto);
    setClickValueAdhar(false);
    setImageStore([]);
    setImageBlobObject([]);
    setImageAadharBlobObject([]);
    setImageAadharStore([]);
    setImgSrcAadhar(userPhoto);
    // setImageFiles(null);
    // setAadharImageFiles(null);
    // setOptionalImageFiles(null);
  };

  const [data, setData] = useState([]);

  const getEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const responseData = await response.data.data;
      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEntries();
  }, []);
  const navigate = useNavigate();
  const handleAttendance = (item) => {
    navigate(`/admin/attendance/${item}`);
  };
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    setFilteredData(maidName);
  }, [maidName]);
  useEffect(() => {
    if (!searchQuery) {
      getMaid();
    }
  }, [searchQuery]);
  const [images, setImages] = useState([]);
  const [imagesAadhaar, setImagesAadhaar] = useState([]);
  const [imagesOptional, setImagesOptional] = useState([]);
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);

    const blobUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blobUrl = URL.createObjectURL(file);
      blobUrls.push(blobUrl);
    }

    setImages(blobUrls);

    const validImageFiles = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split("/")[0]; // Get the type of the file ('image', 'video', etc.)

        if (fileType === "image") {
          validImageFiles.push(file);
        } else {
          // Show error toast for invalid file type
          toast.error("Please upload only image files.");
          fileInputRefImage.current.value = "";
          return; // Exit the function if an invalid file is found
        }
      }

      if (validImageFiles.length > 0) {
        setImageFiles(validImageFiles);
      }
    }
  };

  const handleAadharFileChange = (e) => {
    const files = Array.from(e.target.files);
    const blobUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blobUrl = URL.createObjectURL(file);
      blobUrls.push(blobUrl);
    }

    setImagesAadhaar(blobUrls);
    const validImageFiles = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split("/")[0]; // Get the type of the file ('image', 'video', etc.)

        if (fileType === "image") {
          validImageFiles.push(file);
        } else {
          // Show error toast for invalid file type
          toast.error("Please upload only image files.");
          fileInputRefAadhaarImage.current.value = "";
          return; // Exit the function if an invalid file is found
        }
      }

      if (validImageFiles.length > 0) {
        setAadharImageFiles(validImageFiles);
      }
    }
  };

  const handleOptionalFileChange = (e) => {
    const files = Array.from(e.target.files);
    const blobUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const blobUrl = URL.createObjectURL(file);
      blobUrls.push(blobUrl);
    }

    setImagesOptional(blobUrls);
    const validImageFiles = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split("/")[0]; // Get the type of the file ('image', 'video', etc.)

        if (fileType === "image") {
          validImageFiles.push(file);
        } else {
          // Show error toast for invalid file type
          toast.error("Please upload only image files.");
          fileInputRefOptionlaImage.current.value = "";
          return; // Exit the function if an invalid file is found
        }
      }

      if (validImageFiles.length > 0) {
        setOptionalImageFiles(validImageFiles);
      }
    }
  };
  //handle view Button
  const [allImages, setAllImages] = useState([]);
  const handleOpen = (images) => {
    setOpen(true);
    setAllImages(images);
  };

  useEffect(() => {}, [images]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    height: 400,
    p: 4,
    zIndex: "10000000",
  };
  return (
    <>
      <Layout>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="details-dialog"
          >
            <Box sx={style}>
              {/* Images View */}
              <br/>
              <div className="images_view">
                {allImages?.length > 0 ? (
                  allImages.map((item, index) => (
                    <div key={index}>
                      <img src={item} alt={`Image ${index}`} />
                    </div>
                  ))
                ) : (
                  <div className="no-images-avaliable">No images available</div>
                )}
              </div>
              <div className="cross_button">
              
                  <RxCross2  onClick={handleClose}></RxCross2>
              
              </div>
      
      
            </Box>
          </Modal>
        </div>

        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi"
              ? " Add Regular Entries"
              : "    नियमित प्रविष्टियाँ जोड़ें"}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="add_regular_div">
          <form onSubmit={formik.handleSubmit} className="house_maid_form">
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="houseMaidEnglish">
                {language === "hindi" ? " Name" : "नाम"}{" "}
                <span className="Star_color">*</span>
              </label>
              <br />

              <input
                type="text"
                id="houseMaidEnglish"
                name="houseMaidEnglish"
                value={formik.values.houseMaidEnglish}
                onChange={formik.handleChange}
                className="edit-input-regular"
                maxLength={35}
              />
              {formik.errors.houseMaidEnglish && (
                <div className="error">{formik.errors.houseMaidEnglish}</div>
              )}
            </div>
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="address">
                {language === "hindi" ? " Address" : "पता"}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                className="edit-input-regular"
                maxLength={35}
              />
              {formik.errors.address && (
                <div className="error">{formik.errors.address}</div>
              )}
            </div>
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="aadharNumber">
                {language === "hindi" ? " Aadhaar Number" : " आधार नंबर"}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="number"
                id="aadharNumber"
                name="aadharNumber"
                value={formik.values.aadharNumber}
                onChange={formik.handleChange}
                className="edit-input-regular"
              />
              {formik.errors.aadharNumber && (
                <div className="error">{formik.errors.aadharNumber}</div>
              )}
            </div>

            <div className="edit-input-regular-main-input-div">
              <label className="editLabel">
                {language === "hindi" ? "Gender" : "  लिंग"}{" "}
                <span className="Star_color">*</span>
              </label>
              <div className="male_radio">
                <input
                  type="radio"
                  id="genderMale"
                  name="gender"
                  value="Male"
                  checked={formik.values.gender === "Male"}
                  onChange={formik.handleChange}
                />
                <label className="label_input_radio" htmlFor="genderMale">
                  {" "}
                  {language === "hindi" ? "Male" : "  पुरुष"}
                </label>
              </div>
              <div className="female_radio">
                <input
                  type="radio"
                  id="genderFemale"
                  name="gender"
                  value="Female"
                  checked={formik.values.gender === "Female"}
                  onChange={formik.handleChange}
                />

                <label className="label_input_radio" htmlFor="genderFemale">
                  {language === "hindi" ? " Female" : "महिला"}{" "}
                </label>
              </div>

              {formik.errors.gender && (
                <div className="error_gender">{formik.errors.gender}</div>
              )}
            </div>

            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="image">
                {language === "hindi" ? "  Add Image " : " छवि जोड़ें "}

                <span className="Star_color">*</span>
              </label>
              <br />
              <div className="input-eye-container">
                <input
                  type="file"
                  name="image"
                  multiple
                  onChange={handleImageFileChange}
                  className="edit-input-regular"
                  ref={fileInputRefImage}
                />
                <IoEyeSharp
                  data-toggle="tooltip"
                  className="eyes_view_regular"
                  data-placement="top"
                  title={language === "hindi" ? "view" : "देखना"}
                  onClick={() => handleOpen(images)}
                />
              </div>

              <small className="select-multiple-images-text">
                {language === "hindi"
                  ? "Hold Ctrl to select multiple images"
                  : "एकाधिक छवियों का चयन करने के लिए Ctrl दबाए रखें"}
              </small>
              <br />
              <div className="error_msg">
                {formik.submitCount > 0 && images.length === 0 && (
                  <span style={{ color: "red" }}>Please upload an image</span>
                )}
              </div>
            </div>

            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="image">
                {language === "hindi"
                  ? " Add Aadhaar Image"
                  : "  आधार छवि जोड़ें "}
                <span className="Star_color">*</span>
              </label>
              <br />
              <div className="input-eye-container">
                <input
                  type="file"
                  multiple
                  name="aadharImage"
                  onChange={handleAadharFileChange}
                  className="edit-input-regular"
                  ref={fileInputRefAadhaarImage}
                />
                <IoEyeSharp
                  data-toggle="tooltip"
                  className="eyes_view_regular"
                  data-placement="top"
                  onClick={() => handleOpen(imagesAadhaar)}
                  title={language === "hindi" ? "view" : "देखना"}
                />
              </div>
              <small className=" select-multiple-images-text">
                {language === "hindi"
                  ? "Hold Ctrl to select multiple images"
                  : "    एकाधिक छवियों का चयन करने के लिए Ctrl दबाए रखें "}
              </small>

              <br />

              <div className="error_msg">
                {formik.submitCount > 0 && imagesAadhaar.length === 0 && (
                  <span style={{ color: "red" }}>
                    Please upload an Aadhaar image
                  </span>
                )}
              </div>
            </div>
            <div className="edit-input-regular-main-input-div">
              <label className="editLabel" htmlFor="image">
                {language === "hindi"
                  ? "Other Documents(PAN Card or Other)"
                  : "अन्य दस्तावेज़ (पैन कार्ड, ड्राइविंगलाइसेंस या अन्य)"}
              </label>
              <br />
              <div className="input-eye-container">
                <input
                  type="file"
                  name="optional"
                  multiple
                  onChange={handleOptionalFileChange}
                  className="edit-input-regular"
                  ref={fileInputRefOptionlaImage}
                />
                <IoEyeSharp
                  data-toggle="tooltip"
                  className="eyes_view_regular"
                  data-placement="top"
                  title={language === "hindi" ? "view" : "देखना"}
                  onClick={() => handleOpen(imagesOptional)}
                />
              </div>
              <small className=" select-multiple-images-text">
                {language === "hindi"
                  ? "Hold Ctrl to select multiple images"
                  : "    एकाधिक छवियों का चयन करने के लिए Ctrl दबाए रखें "}
              </small>
              <br />

              <div className="error_msg"></div>
            </div>
            <br />
            <div className="regular_add_button">
              <button className="edit-button" type="submit">
                {language === "hindi" ? "   Add" : " जोड़ें"}
              </button>
            </div>
          </form>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default AddRegularEntries;
