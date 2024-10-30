import React, { useContext, useState } from "react";
import { FaUser, FaAddressCard, FaImages, FaCar } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";
import { LanguageContext } from "../../lib/LanguageContext";
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
import { IoDocuments } from "react-icons/io5";
import { LiaVideoSolid } from "react-icons/lia";
import { FaVideo } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { PORT } from "../../Api/api";
import { useEffect } from "react";

import { useRef } from "react";
import { FaUpload } from "react-icons/fa6";
import Loading from "../../Loading/Loading";
import { MdOutlineSaveAlt } from "react-icons/md";
import SocietyImages from "../../AdminPannel/SocietyUser/AddSocietyImages/SocietyImages";
import SocietyDocuments from "../../AdminPannel/SocietyUser/AddSocietyDocuments/SocietyDocuments";
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
const Modal = () => {
  const [value, setValue] = React.useState(0);
  const { language } = useContext(LanguageContext);
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
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
          <div onClick={toggleDrawer(anchor, true)}>
            <Tooltip
              title={
                language === "english"
                  ? "समाज के दस्तावेज़, छवियां और वीडियो देखें"
                  : "View Society documents,Images and Videos"
              }
              placement="top"
              arrow
            >
              <div className="view-society-media">
                <IoEyeSharp className="edit_setting_icon" />
                &nbsp;
                {language === "hindi" ? "View" : "देखें"}
              </div>
            </Tooltip>
          </div>
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
           
                <div
                  className="close_btn"
                  onClick={toggleDrawer(anchor, false)}
                >
                  <IoMdClose className="close_icons_house" />
                </div>
         

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
                          <IoDocuments /> &nbsp;{" "}
                          {language === "hindi"
                            ? "View Images and Videos "
                            : "छवियाँ और वीडियो देखें"}
                        </div>
                      }
                      {...a11yProps(0)}
                    />

                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          <FaImages /> &nbsp;{" "}
                          {language === "hindi"
                            ? "View Documents"
                            : "दस्तावेज़ देखें"}
                        </div>
                      }
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <SocietyImages data={society_id} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <SocietyDocuments data={society_id} />
                </CustomTabPanel>
              </Box>
            </List>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Modal;
