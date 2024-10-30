import React, { useContext, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import { FaUser } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { FaAddressCard } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { LanguageContext } from "../lib/LanguageContext";
import { IoEyeSharp } from "react-icons/io5";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { IoAddSharp } from "react-icons/io5";
import { Formik, Form, Field } from "formik";
import { FaRegUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import axios from "axios";
import { BsDiagram2Fill } from "react-icons/bs";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useMemo } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { MdPhotoLibrary } from "react-icons/md";
import { HiDocumentAdd } from "react-icons/hi";
import { MdOutlineSaveAlt } from "react-icons/md";
import { useRef } from "react";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const RegularUsersImages = ({ item }) => {
  const { language } = useContext(LanguageContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = React.useState(0);
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const imagePath =
    item && item.image && Array.isArray(item.image) && item.image.length > 0
      ? item.image.map((path) => path && path?.substring(path.indexOf("/") + 1))
      : null;
  const imagePathAadhar =
    item &&
    item.aadharImage &&
    Array.isArray(item.aadharImage) &&
    item.aadharImage.length > 0
      ? item.aadharImage.map(
          (path) => path && path?.substring(path.indexOf("/") + 1)
        )
      : null;
  const imagePathOptional =
    item &&
    item.optionalImage &&
    Array.isArray(item.optionalImage) &&
    item.optionalImage.length > 0
      ? item.optionalImage.map(
          (path) => path && path?.substring(path.indexOf("/") + 1)
        )
      : null;
  const handleModalViewImages = (item) => {
    setSelectedImage(item);
    setIsModalOpen(true);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <h6 className="regular_Details_view">
              <IoEyeSharp
                data-toggle="tooltip"
                className="eyes_view"
                data-placement="top"
                title={language === "hindi" ? "view" : "देखना"}
              />
            </h6>
          </Button>
          <Drawer
            className="regular_drawer   show-top"
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              width: "100vw",
              maxWidth: "100vw",
            }}
          >
          
            
                <div   className="close_btn"  onClick={toggleDrawer(anchor, false)}>
                  <IoMdClose className="" />
                </div>
            
         
            <hr className="hr_line" />
            <List>
              <div className="regular-view-main-div">
                <div className="regular-images-view-title">
                  {language === "hindi" ? " User Details" : " उपयोगकर्ता विवरण"}
                </div>

                <div className="main_content_div">
                  <div className="content2_left_div">
                    <h3 className="house_title_left">
                      <FaUser />
                      &nbsp; {language === "hindi" ? " Name " : " नाम"}
                    </h3>
                    <h3 className="house_title_left">
                      <ImUsers />
                      &nbsp; {language === "hindi" ? "Gender" : " लिंग"}
                    </h3>
                    <h3 className="house_title_left">
                      <FaAddressCard />
                      &nbsp; {language === "hindi" ? "Address" : " पता"}
                    </h3>
                    <h3 className="house_title_left">
                      <FaAddressCard />
                      &nbsp;{" "}
                      {language === "hindi" ? "Aadhaar Number" : " आधार संख्या"}
                    </h3>
                  </div>
                  <div className="content2_right_div">
                    <React.Fragment key={item.id}>
                      <h3 className="house_title_left ">
                        {item.houseMaidEnglish}
                      </h3>
                      <h3 className="house_title_left">{item.gender}</h3>
                      <h3 className="house_title_left">{item.address}</h3>

                      <h3 className="house_title_left">{item.aadharNumber}</h3>
                    </React.Fragment>
                  </div>
                </div>
              </div>
              {/* Bottom Images View */}
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    className="society-view-details-tabs"
                  >
                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                          <IoPersonAdd /> &nbsp;{" "}
                          {language === "hindi"
                            ? "User Images"
                            : "  उपयोगकर्ता छवियाँ"}
                        </div>
                      }
                      {...a11yProps(0)}
                    />

                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                          <MdPhotoLibrary /> &nbsp;{" "}
                          {language === "hindi"
                            ? "Aadhaar Card Images "
                            : " आधार कार्ड छवियाँ"}
                        </div>
                      }
                      {...a11yProps(1)}
                    />
                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                          <HiDocumentAdd />
                          &nbsp;{" "}
                          {language === "hindi"
                            ? "Other documents(Pan Card,Driving Licence or Other) "
                            : "  अन्य दस्तावेज़ (पैन कार्ड, ड्राइविंग लाइसेंस या अन्य)"}
                        </div>
                      }
                      {...a11yProps(2)}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <div className="regular-view-images-div">
                    {imagePath &&
                      imagePath.map((item, index) => (
                        <img
                          key={index}
                          src={`/${item}`}
                          onClick={() => handleModalViewImages(item)}
                          alt=""
                        />
                      ))}
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <div className="regular-view-images-div">
                    {imagePathAadhar &&
                      imagePathAadhar.map((item, index) => (
                        <img key={index} src={`/${item}`} alt="" />
                      ))}
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <div className="regular-view-images-div">
                    {imagePathOptional && imagePathOptional.length > 0 ? (
                      imagePathOptional.map((item, index) => (
                        <img
                          key={index}
                          src={`/${item}`}
                          alt={`Optional Image ${index + 1}`}
                        />
                      ))
                    ) : (
                      <div className="not_Added">
                        {" "}
                        <b>
                          {" "}
                          {language === "hindi"
                            ? "Not Added ! "
                            : " नहीं जोड़ा गया!"}
                        </b>
                      </div>
                    )}
                  </div>
                </CustomTabPanel>{" "}
              </Box>
            </List>
          </Drawer>
        </React.Fragment>
      ))}
      {/* {isModalOpen && <ModalViewImages data={selectedImage} />} */}
    </div>
  );
};

export default RegularUsersImages;
