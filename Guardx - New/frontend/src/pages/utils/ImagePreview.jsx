import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Modal,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { PORT } from "../../port/Port";

function ImagePreview({ image }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <>
      {/* Card for Image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          padding: 2,
        }}
      >
        <Card
          onClick={handleOpen}
          sx={{
            maxWidth: 345,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={`${PORT}${image.split("public")[1]}` || "https://via.placeholder.com/300"}
            alt="Preview"
            sx={{
              borderRadius: "5px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          />
        </Card>
      </Box>

      {/* Full-Screen Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%",
            maxHeight: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            outline: "none",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#f44336", // Red background
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Full-Size Image */}
          <img
            src={image? `${PORT}${image.split("public")[1]}` : "https://via.placeholder.com/300"}
            alt="Full Preview"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}

export default ImagePreview;
