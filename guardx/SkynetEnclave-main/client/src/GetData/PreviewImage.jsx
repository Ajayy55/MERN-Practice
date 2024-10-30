// import React, { useContext, useEffect, useState } from "react";
// import { RxEyeOpen } from "react-icons/rx";
// import { DNA } from "react-loader-spinner";
// import Backdrop from "@mui/material/Backdrop";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import { RxCross2 } from "react-icons/rx";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import { LanguageContext } from "../lib/LanguageContext";
// import { IoEyeSharp } from "react-icons/io5";
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-45%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   zIndex: 1000,
// };

// const PreviewImage = ({ item }) => {
//   const { language } = useContext(LanguageContext);
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   });
//   return (
//     <div>
//       <button onClick={handleOpen}>
//         <h5 className="all_data mt-3">
//           <IoEyeSharp
//             data-toggle="tooltip"
//             className="eyes_view"
//             data-placement="top"
//             title={language === "hindi" ? "view" : "देखना"}
//           />
//         </h5>
//       </button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//          className="details-dialog"
//       >
//         <Box sx={style}>
//           <div className="button_cross button_close_guest">
//             <Button onClick={handleClose}>
//               <RxCross2 className="cross_icon" />
//             </Button>
//           </div>
//           <h6 className="center_image">
//             {language === "hindi" ? "Aadhaar Images" : "आधार छवि"}
//           </h6>
//           {loading ? (
//             <div className="loader_div">
//               <DNA
//                 visible={true}
//                 height="90"
//                 width="90"
//                 ariaLabel="dna-loading"
//                 wrapperStyle={{}}
//                 wrapperClass="dna-wrapper"
//               />
//             </div>
//           ) : (
//             <div className="user_images_div_getData_aadharImg">
//               {item?.adharImg?.length>0?Array.isArray(item.adharImg) &&
//                 item.adharImg.map((path, index) => (
//                   <img
//                     key={index}
//                     src={`/${path.replace("public/", "")}`}
//                     alt=""
//                   />
//                 )):<div className="text-center w-100 p-4">
//                   {language === "hindi" ? "No Images" : "कोई चित्र नहीं"}</div>
//                 }
//             </div>
//           )}
//            <br/>
//           <h6 className="center_image">
//             {language === "hindi" ? "User Images" : " उपयोगकर्ता छवि"}
//           </h6>
//           {loading ? (
//             <div className="loader_div">
//               <DNA
//                 visible={true}
//                 height="90"
//                 width="90"
//                 ariaLabel="dna-loading"
//                 wrapperStyle={{}}
//                 wrapperClass="dna-wrapper"
//               />
//             </div>
//           ) : (
//             <div className="user_images_div_getData">
//               {Array.isArray(item.image) &&
//                 item.image.map((path, index) => (
//                   <img
//                     key={index}
//                     src={`/${path.replace("public/", "")}`}
//                     alt=""
//                   />
//                 ))}
//             </div>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default PreviewImage;
import React, { useContext, useState } from "react";
import { FaUser, FaAddressCard, FaImages, FaCar } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";
import { LanguageContext } from "../lib/LanguageContext";
import { IoEyeSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { FaHouseUser } from "react-icons/fa";

import Tooltip from "@mui/material/Tooltip";
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
const PreviewImage = ({ item }) => {
  const [value, setValue] = React.useState(0);
  const { language } = useContext(LanguageContext);

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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Tooltip
            title={language === "hindi" ? "view" : "देखना"}
            placement="top"
            arrow
          >
            <div onClick={toggleDrawer(anchor, true)}>
              <h5 className=" mt-3 house-view-icon ">
                <IoEyeSharp
                  data-toggle="tooltip"
                  className="eyes_view"
                  data-placement="top"
                />
              </h5>
            </div>
          </Tooltip>
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
            {/* <div className="heading_user"> */}
            {/* <div> */}
            <div className="close_btn" onClick={toggleDrawer(anchor, false)}>
              <IoMdClose className="close_icons_house" />
            </div>
            {/* </div> */}
            {/* </div> */}
            <hr className="hr_line" />
            <List>
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
                          <FaImages /> &nbsp;{" "}
                          {language === "hindi" ? "Images" : "छवि"}
                        </div>
                      }
                      {...a11yProps(0)}
                    />

                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          <FaImages /> &nbsp;{" "}
                          {language === "hindi" ? "Aadhaar Images" : "आधार छवि"}
                        </div>
                      }
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <div className="regular-view-images-div">
                    {item?.image?.length > 0 ? (
                      Array.isArray(item.image) &&
                      item.image.map((path, index) => (
                        <img
                          key={index}
                          src={`/${path.replace(
                            "public/",
                            ""
                          )}`}
                          alt=""
                        />
                      ))
                    ) : (
                      <div className="text-center w-100 p-4">
                        {language === "hindi" ? "No Images" : "कोई चित्र नहीं"}
                      </div>
                    )}
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <div className="regular-view-images-div">
                    {item?.adharImg?.length > 0 ? (
                      Array.isArray(item.adharImg) &&
                      item.adharImg.map((path, index) => (
                        <img
                          key={index}
                          src={`/${path.replace(
                            "public/",
                            ""
                          )}`}
                          alt=""
                        />
                      ))
                    ) : (
                      <div className="text-center w-100 p-4">
                        {language === "hindi" ? "No Images" : "कोई चित्र नहीं"}
                      </div>
                    )}
                  </div>
                </CustomTabPanel>
              </Box>
            </List>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PreviewImage;
