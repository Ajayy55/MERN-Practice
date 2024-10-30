import React, { useEffect, useState, useRef, useContext } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { RiImageAddFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { PORT } from "../Api/api";
import axios from "axios";
import "./addregular.css";
import Swal from "sweetalert2";
import { LanguageContext } from "../lib/LanguageContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};

const ShowRegularImages = ({ data, view }) => {
  const { language } = useContext(LanguageContext);
  const [viewPoint, setViewPoint] = useState(view);
  const [open, setOpen] = useState(false);
  const [getEditImages, setGetEditImages] = useState([]);
  const [aadharImageUrls, setAadharImageUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlsImage, setImageUrlsImage] = useState([]);
  const [imageUrlOptional, setImageUrlOptional] = useState([]);

  const [showButton, setShowButton] = useState(false);
  const fileInputRef = useRef(null);
  const paramsId = useParams();
  const id = paramsId.id;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImageUrls([]);
    setAadharImageUrls([]);
    setImageUrlsImage([]);
    setImageUrlOptional([]);
  };

  const getEntryData = async () => {
    try {
      const response = await axios.get(`${PORT}/updateHouseMaid/${id}`);
      if (response.data.data) {
        setGetEditImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching entry data:", error);
    }
  };

  useEffect(() => {
    getEntryData();
  }, [id]);

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    const urlsWithType = files.map((file) => ({ file, type: viewPoint }));

    setImageUrls((prevUrls) => [...prevUrls, ...urlsWithType]);
    setShowButton(true);

    urlsWithType.forEach(({ file, type }) => {
      if (type === "aadharImage") {
        setAadharImageUrls((prevUrls) => [...prevUrls, file]);
      } else if (type === "image") {
        setImageUrlsImage((prevUrls) => [...prevUrls, file]);
      } else if (type === "optionalImage") {
        setImageUrlOptional((prevUrls) => [...prevUrls, file]);
      }
    });
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async (imageUrl) => {
    try {
      const data = { imageType: view, imageUrl: imageUrl };
      await axios.put(`${PORT}/delete-images/${id}`, data);

      setGetEditImages((prevImages) => ({
        ...prevImages,
        [view]: prevImages[view].filter((image) => image !== imageUrl),
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteNewImages = (imageToDelete) => {
    setImageUrls((prevUrls) =>
      prevUrls.filter(({ file }) => file !== imageToDelete)
    );
    imageUrls.length === 1 ? setShowButton(false) : setShowButton(true);
  };

  const handleUpdateImage = async () => {
    try {
      const formData = new FormData();
      imageUrls.forEach(({ file, type }) => {
        formData.append(type, file);
      });

      // Show confirmation dialog
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "You want to add this image",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update images!",
        customClass: {
          container: "my-swal",
        },
      });

      if (confirmResult.isConfirmed) {
        const response = await axios.put(
          `${PORT}/updateHouseMaid/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response) {
          Swal.fire({
            title: "Images Updated!",
            text: "Your images have been updated successfully.",
            icon: "success",
          });
          handleClose(); // Close the modal after successful update
          getEntryData();
        }
      }
    } catch (error) {
      console.error("Error updating images:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update images. Please try again later.",
        icon: "error",
      });
    }
  };

  const images = getEditImages[view] || [];

  return (
    <div>
      <h6 className="view-regular-images" onClick={handleOpen}>
        {language === "hindi" ? "view & update" : "देखें और अपडेट करें"}
      </h6>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        className="show-top"
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="cross_button">
              <RxCross2 onClick={handleClose}></RxCross2>
            </div>
            <br />
            <div className="main_regular_div">
              <div className="left_regular_image_div">
                {images.length > 0 ? (
                  images.map((item, index) => (
                    <div key={index} className="regular_image_div">
                      <div
                        className="cross_regular_images_main"
                        onClick={() => handleDelete(item)}
                      >
                        <b className="cross_regular_images">
                          <RxCross2 className="regualr_font_weight" />
                        </b>
                      </div>
                      <img src={`/${item.replace("public/", "")}`} alt="" />
                    </div>
                  ))
                ) : (
                  <h3>Your Images are Deleted!</h3>
                )}
              </div>
              <div
                className="right_regular_image_div"
                onClick={() => handleDivClick()}
              >
                <RiImageAddFill className="add_icon_regular" />
                Add image
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={handleFileInputChange}
                />
              </div>
            </div>
            <div>
              {/* <h1 className='error-notAdded-img'>New Added Images</h1> */}
              <br />
              <div className="newAdded_image_div">
                {imageUrls.length > 0 ? (
                  imageUrls.map(({ file }, index) => (
                    <div className="newAdded_image-img" key={index}>
                      <div onClick={() => handleDeleteNewImages(file)}>
                        <b className="cross_regular_images">
                          <RxCross2 className="regualr_font_weight" />
                        </b>
                      </div>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected image ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <p></p>

                  // <h6 className='error-notAdded-img2'>You haven't added any images Yet!</h6>
                )}
              </div>
              {showButton === true ? (
                <div className="update-image-btn">
                  <button
                    className="update-image-btn"
                    onClick={handleUpdateImage}
                  >
                    Update Images
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ShowRegularImages;
