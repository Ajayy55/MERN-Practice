import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import { FiImage, FiFileText } from "react-icons/fi"; // Import the icons

const ViewDocumentModal = ({ mediaItem, icon }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fileExtension = mediaItem.path.split(".").pop();
  const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
  const isPdf = fileExtension === "pdf";

  return (
    <div>
      <React.Fragment>
        <div onClick={handleClickOpen} className="view-button">
          {icon} View
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="document-dialog-title"
          aria-describedby="document-dialog-description"
          className="dialog-top"
          PaperProps={{
            style: {
              width: "700px",
              height: "500px",
              maxWidth: "none",
            },
          }}
        >
          <DialogTitle id="document-dialog-title">
           <h5 className="view-image-pdf-title"> { isImage ? "View Image" : isPdf ? "View PDF" : "View Document"}</h5>
            <div className="top-section">
              <RxCrossCircled onClick={handleClose} className="close-icon" />
            </div>
          </DialogTitle>
          <DialogContent>
            {isImage ? (
              <img
                src={`/${mediaItem.path?.replace(
                  "public/",
                  ""
                )}`}
                alt={`Media ${mediaItem._id}`}
                className="full-image"
              />
            ) : isPdf ? (
              <embed
                src={`/${mediaItem.path?.replace(
                  "public/",
                  ""
                )}`}
                type="application/pdf"
                className="full-pdf"
                width="100%"
                height="400px"
              />
            ) : (
              <a
                href={`/${mediaItem.path?.replace(
                  "public/",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document {mediaItem._id}
              </a>
            )}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default ViewDocumentModal;
