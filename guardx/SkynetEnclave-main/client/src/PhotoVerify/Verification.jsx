import React, { useState, useCallback, useRef } from "react";
import userPhoto from "./avatar.webp";
import adharPhoto from "./adhar.png";
import "./style.css";
import Backbutton from "../GoBack/Backbutton";
import { PORT } from "../Api/api";
import axios from "axios";
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import GuardLayout from "../lib/GuardLayout";
import { LanguageContext } from "../lib/LanguageContext";
import { useContext } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { TextField, Container } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { BsCamera } from "react-icons/bs";

function Verification({ setCurrentStep, prevStep }) {
  const { language } = useContext(LanguageContext);
  const [clickValue, setClickValue] = useState(" Click a Photo");
  const [clickValueAdhar, setClickValueAdhar] = useState("Click a  photo");
  const [clickValueHindi, setClickValueHindi] = useState("फोटो क्लिक करें");
  const [clickValueAdharHindi, setClickValueAdharHindi] =
    useState(" फोटो क्लिक करें");
  const [imageBlobObject, setImageBlobObject] = useState([]);
  const [imageStore, setImageStore] = useState([]);
  const [sendUserImages, setSendUserImages] = useState([]);
  const [showDivUserImage, setShowDivUserImage] = useState(false);
  const [showDivAadharImage, setShowAadharImage] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    const entry = JSON.parse(localStorage.getItem("entry"));
    const purpose = JSON.parse(localStorage.getItem("purpose"));
    const houseDetails =(localStorage.getItem("house"));
    localStorage.setItem("adharImg", JSON.stringify(AdharImgSrc));
    localStorage.setItem("userImg", JSON.stringify(imgSrc));
    const name = localStorage.getItem("name");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const aadhaarNumber = localStorage.getItem("aadhaarNumber");
    const adharImg = JSON.parse(localStorage.getItem("adharImg"));
    const guardId = JSON.parse(localStorage.getItem("guardId"));
    const createdBy = JSON.parse(localStorage.getItem("roleId"));
    const society_id = JSON.parse(localStorage.getItem("society_id"));
    const house_id=JSON.parse(localStorage.getItem("house_id"));
    try {
      if (imageStore.length === 0) {
        if (language === "hindi") {
          toast.warn(`Please Click the photo before submitting`);
          return;
        }
      }
      if (imageStore.length === 0) {
        if (language === "english") {
          toast.warn(`कृपया फोटो किंचकर सबमिट करें`);
          return;
        }
      }
      if (language === "hindi") {
        Swal.fire({
          title: "Do you want to save the Data?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Save",
          denyButtonText: `Don't save`,
        }).then(async (result) => {
          // Change here
          if (result.isConfirmed) {
            try {
              const formData = new FormData();
              formData.append("entryType", entry);
              formData.append("purposeType", purpose);
              formData.append("houseDetails", houseDetails);
              formData.append("guardId", guardId);
              formData.append("createdBy", createdBy);
              formData.append("society_id", society_id);
              formData.append("name", name);
              formData.append("phoneNumber", phoneNumber);
              formData.append("aadhaarNumber", aadhaarNumber);
              formData.append("house_id", house_id);
              sendUserImages.forEach((imageBlob, index) => {
                formData.append("image", imageBlob);
              });
              sendAadharImages.forEach((imageAadharBlob, index) => {
                formData.append("aadharImage", imageAadharBlob);
              });
              const response = await axios.post(
                `${PORT}/nonVerified`,
                formData
              );
              setCurrentStep(1);
              localStorage.removeItem("entry");
              localStorage.removeItem("purpose");
              localStorage.removeItem("houseDetails");
              localStorage.removeItem("adharImg");
              localStorage.removeItem("userImg");
              localStorage.removeItem("name");
              localStorage.removeItem("phoneNumber");
              localStorage.removeItem("aadhaarNumber");
              localStorage.removeItem("house_id");
              setSendUserImages([]);
            } catch (error) {
              console.error("Error saving data:", error);
              Swal.fire("Error", "Failed to save data", "error");
            }
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
      }

      if (language === "english") {
        Swal.fire({
          title: "क्या आप डेटा को सहेजना चाहते हैं?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "सहेजें",
          denyButtonText: `असहेजें`,
        }).then(async (result) => {
          // Change here

          if (result.isConfirmed) {
            try {
              const formData = new FormData();
              formData.append("entryType", entry);
              formData.append("purposeType", purpose);
              formData.append("houseDetails", houseDetails);
              formData.append("guardId", guardId);

              formData.append("createdBy", createdBy);
              formData.append("society_id", society_id);
              formData.append("name", name);
              formData.append("phoneNumber", phoneNumber);
              formData.append("aadhaarNumber", aadhaarNumber);
              formData.append("house_id", house_id);
              sendUserImages.forEach((imageBlob, index) => {
                formData.append("image", imageBlob);
              });
              sendAadharImages.forEach((imageAadharBlob, index) => {
                formData.append("aadharImage", imageAadharBlob);
              });
              const response = await axios.post(
                `${PORT}/nonVerified`,
                formData
              );
              setCurrentStep(1);
              localStorage.removeItem("entry");
              localStorage.removeItem("purpose");
              localStorage.removeItem("houseDetails");
              localStorage.removeItem("adharImg");
              localStorage.removeItem("userImg");
              localStorage.removeItem("name");
              localStorage.removeItem("phoneNumber");
              localStorage.removeItem("aadhaarNumber");
              localStorage.removeItem("house_id");
              setSendUserImages([]);
              setCurrentStep(1);
            } catch (error) {
              console.error("Error saving data:", error);
              Swal.fire("Error", "Failed to save data", "error");
            }
          }
        });
      }
    } catch (error) {
      console.error("Error handling submission:", error);
    }
  };

  // Function to capture user's photo
  const webcamRef = useRef(null);

  const [imgSrc, setImgSrc] = useState(userPhoto);
  const capture = useCallback(async () => {
    const imageSrc = await webcamRef.current.getScreenshot();
    const imageBlob = await fetchImageBlob(imageSrc);
    setShowDivUserImage(true);

    setImageBlobObject((prevImageUrls) => [...prevImageUrls, { imageBlob }]);

    const url = URL.createObjectURL(imageBlob);
    setImgSrc(url);
    setImageStore((prevImageUrls) => [...prevImageUrls, { url }]);
    setImageBlobObject((updatedImageBlobObject) => {
      const imageBlobArray = updatedImageBlobObject.map(
        (item) => item.imageBlob
      );
      setSendUserImages(imageBlobArray);
      return updatedImageBlobObject;
    });
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
    setClickValue("Add more");
    setClickValueHindi("और जोड़ें");
  };

  // Function to capture Adhar photo
  const AdharWebcamRef = useRef(null);
  const [AdharImgSrc, AdharSetImgSrc] = useState(adharPhoto);
  const [imageAadharStore, setImageAadharStore] = useState([]);
  const [aadharImageBlobObject, setAadharImageBlobObject] = useState([]);
  const [sendAadharImages, setSendAadharImages] = useState([]);
  const captureAdhar = useCallback(async () => {
    const AdharImageSrc = await AdharWebcamRef.current.getScreenshot();

    const imageAadharBlob = await fetchImageAadharBlob(AdharImageSrc);
    setShowAadharImage(true);
    setAadharImageBlobObject((prevImageUrls) => [
      ...prevImageUrls,
      { imageAadharBlob },
    ]);
    const url = URL.createObjectURL(imageAadharBlob);
    setImageAadharStore((prevImageUrls) => [...prevImageUrls, { url }]);
    AdharSetImgSrc(url);
    setAadharImageBlobObject((updatedImageBlobObject) => {
      const imageBlobArray = updatedImageBlobObject.map(
        (item) => item.imageAadharBlob
      );
      setSendAadharImages(imageBlobArray);
      return updatedImageBlobObject;
    });
  }, [AdharWebcamRef]);

  const fetchImageAadharBlob = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      return blob;
    } catch (error) {
      console.error("Error fetching image blob:", error);
      return null;
    }
  };
  const handleDeleteAaadharImage = (index) => {
    const updatedAadharImagesUrl = [...imageAadharStore];
    updatedAadharImagesUrl.splice(index, 1);
    setImageAadharStore(updatedAadharImagesUrl);

    if (updatedAadharImagesUrl.length === 0) {
      setClickValueAdhar("Click photo");
      setClickValueAdharHindi("फोटो क्लिक करें");
      setAadharImageBlobObject([]);
      setSendAadharImages([]);
      setShowAadharImage(false);
      AdharSetImgSrc(adharPhoto);
    } else {
      setAadharImageBlobObject((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        setSendAadharImages(updated.map((item) => item.imageAadharBlob));
        return updated;
      });
    }
  };
  const handleDeleteUserImage = (index) => {
    const updatedAadharImagesUrl = [...imageStore];
    updatedAadharImagesUrl.splice(index, 1);
    setImageStore(updatedAadharImagesUrl);
    setImageBlobObject((prev) => {
      const updatedBlobs = [...prev];
      updatedBlobs.splice(index, 1);
      setSendUserImages(updatedBlobs.map((item) => item.imageBlob));
      if (updatedBlobs.length === 0) {
        setClickValue("Click a photo");
        setClickValueHindi("फोटो क्लिक करें");
        setShowDivUserImage(false);
        setImgSrc(userPhoto);
        setImageBlobObject([]);
        setSendUserImages([]);
      }

      return updatedBlobs;
    });
  };

  const AdharRetake = () => {
    AdharSetImgSrc(null);
    setClickValueAdhar("Add more");
    setClickValueAdharHindi("और जोड़ें");
  };
  const fetchImageBlob = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching image blob:", error);
      return null;
    }
  };

  // AddMore Details
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    zIndex: 300,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    aadhaarNumber: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "name") {
      localStorage.setItem("name", value);
    } else if (name === "phoneNumber") {
      localStorage.setItem("phoneNumber", value);
    } else if (name === "aadhaarNumber") {
      localStorage.setItem("aadhaarNumber", value);
    }
  };

  const handleSubmitFormData = (e) => {
    e.preventDefault();
    handleClose();
    setFormData("");
  };
  //Images Section Functionalty
  const [currentIndex, setCurrentIndex] = useState(0);
  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImgSrc(imageStore[currentIndex - 1].url);
    }
  };

  const goForward = () => {
    if (currentIndex < imageStore.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImgSrc(imageStore[currentIndex + 1].url);
    }
  };
  // Aadhaar Section functionality
  const [currentAadharIndex, setCurrentAadharIndex] = useState(0);
  const goBackAadhar = () => {
    if (currentAadharIndex > 0) {
      setCurrentAadharIndex(currentAadharIndex - 1);
      AdharSetImgSrc(imageAadharStore[currentAadharIndex - 1].url);
    }
  };

  const goForwardAadhar = () => {
    if (currentAadharIndex < imageAadharStore.length - 1) {
      setCurrentAadharIndex(currentAadharIndex + 1);
      AdharSetImgSrc(imageAadharStore[currentAadharIndex + 1].url);
    }
  };
  return (
    <>
      <GuardLayout>
        {/* AddMore Deatils */}

        <div className="main-verificattion">
          <div className="photo-verification">
            <div id="photo-con" className="container">
              <div className="next_previous_main_div">
                <Tooltip
                  title={
                    language === "english" ? " पिछली फोटो " : "Previous Photo "
                  }
                  placement="top"
                  arrow
                >
                  <button
                    className="next_previous_button"
                    onClick={goBack}
                    disabled={currentIndex === 0}
                  >
                    <GrPrevious />
                  </button>
                </Tooltip>
                <Tooltip
                  title={language === "english" ? "अगली फोटो" : "Next Photo"}
                  placement="top"
                  arrow
                >
                  <button
                    className="next_previous_button"
                    onClick={goForward}
                    disabled={currentIndex === imageStore.length - 1}
                  >
                    <GrNext />
                  </button>
                </Tooltip>
              </div>
              <br />
              {imgSrc ? (
                <>
                  {imageStore.length > 0 ? (
                    <button
                      className="btn_delete_images"
                      onClick={() => handleDeleteUserImage(currentIndex)}
                    >
                      <RxCross2 />
                    </button>
                  ) : (
                    <></>
                  )}
                  <img
                    src={imgSrc}
                    alt={`Captured Image ${currentIndex}`}
                    onClick={retake}
                  />
                </>
              ) : (
                <Webcam
                  height={150}
                  width={250}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.8}
                  className="webcameUserImage"
                />
              )}
              <div className="btn-container">
                {imgSrc ? (
                  <div>
                    <div onClick={retake} className="btn_image_button">
                      <BsCamera />
                      {language === "english" ? clickValueHindi : clickValue}
                    </div>
                  </div>
                ) : (
                  <div onClick={capture}>
                    {language === "english" ? "फोटो किंचे" : "Click photo"}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="adhar-verification">
            <div id="photo-con" className="container">
              <div className="next_previous_main_div">
                <Tooltip
                  title={
                    language === "english" ? " पिछली फोटो " : "Previous Photo "
                  }
                  placement="top"
                  arrow
                >
                  <button
                    className="next_previous_button"
                    onClick={goBackAadhar}
                    disabled={currentAadharIndex === 0}
                  >
                    <GrPrevious />
                  </button>
                </Tooltip>
                <Tooltip
                  title={language === "english" ? "अगली फोटो" : "Next Photo"}
                  placement="top"
                  arrow
                >
                  <button
                    className="next_previous_button"
                    onClick={goForwardAadhar}
                    disabled={
                      currentAadharIndex === imageAadharStore.length - 1
                    }
                  >
                    <GrNext />
                  </button>
                </Tooltip>
              </div>
              <br />
              {AdharImgSrc ? (
                <>
                  {imageAadharStore.length > 0 ? (
                    <button
                      className="btn_delete_aadhaar_images"
                      onClick={() =>
                        handleDeleteAaadharImage(currentAadharIndex)
                      }
                    >
                      <RxCross2 />
                    </button>
                  ) : (
                    <></>
                  )}
                  <img
                    src={AdharImgSrc}
                    alt={`Captured Aadhar Image ${currentAadharIndex}`}
                    onClick={AdharRetake}
                  />
                </>
              ) : (
                <Webcam
                  height={188}
                  width={250}
                  ref={AdharWebcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.8}
                  className="webCamCamera"
                />
              )}
              <div className="btn-container-Adhar">
                {AdharImgSrc ? (
                  <div>
                    <div
                      className="addhar_btn_padding btn_image_button"
                      onClick={AdharRetake}
                    >
                      <BsCamera />
                      {language === "english"
                        ? clickValueAdharHindi
                        : clickValueAdhar}
                    </div>
                  </div>
                ) : (
                  <div className="addhar_btn_padding" onClick={captureAdhar}>
                    {language === "english" ? "फोटो किंचे" : "Click photo"}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="add_more_data_main">
            <div className="add_more_data_inner">
              <form
                onSubmit={handleSubmitFormData}
                className="add_more_data_inner_form"
              >
                <Box sx={{ width: "400px" }}>
                  <TextField
                    label={language === "english" ? "नाम" : "Name"}
                    name="name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>{" "}
                <br /> <br />
                <Box sx={{ width: "400px" }}>
                  <TextField
                    label={
                      language === "english" ? "फ़ोन नंबर" : "Phone Number"
                    }
                    name="phoneNumber"
                    variant="outlined"
                    fullWidth
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
              </form>
            </div>
            <div className="submit-btn">
              <button onClick={handleSubmit}>
                {language === "english" ? "सबमिट करें" : "Submit"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <Tooltip
            title={language === "english" ? "  पिछला पृष्ठ" : "Previous Page"}
            placement="top"
            arrow
          >
            <div className="back-btn">
              <button onClick={prevStep}>
                <IoIosArrowBack />
              </button>
              &nbsp;
              <b className="back_text">
                {language === "english" ? "  पिछला" : "Back"}
              </b>
            </div>
          </Tooltip>
        </div>
        <ToastContainer />
      </GuardLayout>
    </>
  );
}

export default Verification;
