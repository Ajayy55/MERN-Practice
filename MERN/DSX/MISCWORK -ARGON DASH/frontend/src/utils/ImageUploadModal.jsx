import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { PORT } from "../PORT/PORT";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ImageUploadModal = ({ open, handleClose, uid }) => {
  const navigate =useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const handleRemove = (event) => {
    setSelectedImage(null);
    handleClose();
  };
  const handleUpload = async () => {
    // Handle the image upload logic here
    const url = `${PORT}setProfilePicture/${uid}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.data);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "content-Type": "multipart/form-data",
        },
      });
      
      if (response.status===200) {
        console.log("Image uploaded:", selectedImage);
        handleClose();
        handleRemove();
      } else {
        console.log("file upload error",error);
      }
    } catch (error) {
      console.log("file upload error",error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Upload Image
        </Typography>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: "100%", marginTop: "16px" }}
          />
        )}
        <Button
          variant="contained"
          color="warning"
          onClick={handleRemove}
          disabled={!selectedImage}
          sx={{ marginTop: "16px", marginRight: "10px" }}
        >
          close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedImage}
          sx={{ marginTop: "16px" }}
        >
          Upload
        </Button>
      </Box>
    </Modal>
  );
};

export default ImageUploadModal;
