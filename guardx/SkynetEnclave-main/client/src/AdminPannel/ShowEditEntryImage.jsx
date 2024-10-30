import React, { useContext } from "react";
// import * as React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IoEyeSharp } from "react-icons/io5";
import "./nav.css";
import { LanguageContext } from "../lib/LanguageContext";
const ShowEditEntryImage = (props) => {
  const { language } = useContext(LanguageContext);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} style={{ fontSize: "10px" }}>
        <h6>
          <IoEyeSharp
            data-toggle="tooltip"
            className="eyes_view"
            data-placement="top"
            title={language === "hindi" ? "view" : "देखना"}
          />
        </h6>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal_edit_entry_image"
      >
        <Box sx={style}>
          {props.data.getEditImage ? (
            <div className="edit_Entry_image_modal">
              <img
                src={`/${props.data.getEditImage.replace("public/", "")}`}
                alt=""
              />
            </div>
          ) : (
            <>
              <h6>
                {props.data.entry ? (
                  (() => {
                    let words = props.data.entry.split(" ");
                    const initials = words[0]?.substring(0, 1).toUpperCase();
                    return (
                      <div className="purpose_default_icon">
                        <h5>{initials}</h5>
                      </div>
                    );
                  })()
                ) : (
                  <div className="align-middle text-center purpose_icon_title">
                    <h5 className="initialss">N/A</h5>
                  </div>
                )}
              </h6>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ShowEditEntryImage;
