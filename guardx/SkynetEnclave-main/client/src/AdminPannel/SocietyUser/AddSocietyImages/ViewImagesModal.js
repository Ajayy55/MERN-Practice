import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";

import "./style.css";
const ViewImagesModal = ({ mediaItem,icon }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <React.Fragment>
        <div variant="outlined" className="cursor-pointer" onClick={handleClickOpen}>
        {icon} View
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-top"
          PaperProps={{
            style: {
              width: "700px",
              height: "500px",
              maxWidth: "none",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {" "}
            <div className="top-section" onClick={handleClose}>
              <RxCrossCircled  className="close-icon" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="modal-images-video-view">
            {mediaItem.type === "image" ? (
              <img
                src={`/${mediaItem.path?.replace(
                  "public/",
                  ""
                )}`}
                alt={`Media ${mediaItem._id}`}
                className="full-image"
              />
            ) : mediaItem.type === "video" ? (
              <video controls className="full-video">
                <source
                  src={`/${mediaItem.path?.replace(
                    "public/",
                    ""
                  )}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default ViewImagesModal;
