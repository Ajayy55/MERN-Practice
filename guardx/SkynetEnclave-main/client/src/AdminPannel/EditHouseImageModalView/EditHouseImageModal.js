import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IoEyeSharp } from "react-icons/io5";
import "./style.css";
import { RxCrossCircled } from "react-icons/rx";

import { LanguageContext } from "../../lib/LanguageContext";
const EditHouseImageModal = (props) => {
  console.log(props.item);
  const { language } = useContext(LanguageContext);
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div onClick={handleOpen} style={{ fontSize: "10px" }}>
        <IoEyeSharp
          data-toggle="tooltip"
          className="house-owner-image-view-icon"
          data-placement="top"
          title={language === "hindi" ? "view" : "देखना"}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="owner-view-image-cross-button">
            <RxCrossCircled
              onClick={handleClose}
              className="owner-view-image-cross-button-icon"
            />
          </div>
          {props.data[0] ? (
            <div className="owner-images-modal-view">
              <img src={`/${props.data[0].replace("public/", "")}`} alt="" />
            </div>
          ) : (
            <>
              <div className="owner-modal-view-not-image-main">
                <h5 className="owner-modal-view-not-image">{props.item}</h5>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default EditHouseImageModal;
