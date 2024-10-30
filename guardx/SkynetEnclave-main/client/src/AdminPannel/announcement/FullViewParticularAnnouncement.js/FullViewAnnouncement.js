import React, { useContext, useState } from "react";
import { FaUser, FaAddressCard, FaImages, FaCar } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";
import { LanguageContext } from "../../../lib/LanguageContext";
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
import { AiOutlineFileText } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { AiOutlineCalendar } from "react-icons/ai";
import "./style.css";
import { MdCategory } from "react-icons/md";

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
const FullViewAnnouncement = ({ data }) => {
  console.log(data, "date");
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
          <div onClick={toggleDrawer(anchor, true)}>
            <h5 className="all_data mt-3">
              <IoEyeSharp
                data-toggle="tooltip"
                className="eyes_view"
                data-placement="top"
                title={language === "hindi" ? "view" : "देखना"}
              />
            </h5>
          </div>
          <Drawer
            className="regular_drawer   show-top"
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              width: "50vw",
              maxWidth: "50vw",
            }}
          >
            <div className="close_btn" onClick={toggleDrawer(anchor, false)}>
              <IoMdClose className="close_icons_house" />
            </div>

            <hr className="hr_line" />
            <List>
              <div className="regular-view-main-div">
                <div className="regular-images-view-title">
                  {" "}
                  {language === "hindi"
                    ? "Announcement Details"
                    : "घोषणा विवरण"}
                </div>
                <div className="main_content_div">
                  <div className="content1_left_div ">
                    <h3 className="house_title_left">
                      <AiOutlineFileText />
                      &nbsp; {language === "hindi" ? "Title " : "शीर्षक"}
                    </h3>
                    <h3 className="house_title_left view-full-announcement-for-description-title">
                      <BiMessageDetail />
                      &nbsp;{language === "hindi" ? "Description " : "विवरण"}
                    </h3>
                    <h3 className="house_title_left">
                      <AiOutlineCalendar />
                      &nbsp;{language === "hindi" ? "Date " : " तारीख"}
                    </h3>
                    <h3 className="house_title_left">
                      <MdCategory />
                      &nbsp;{language === "hindi" ? "Category " : " श्रेणी"}
                    </h3>
                  </div>
                  <div className="content1_right_div">
                    <React.Fragment key={data.id}>
                      <h3 className="user_images_heading">
                        {data.title ? data.title : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading view-full-announcement-for-description ">
                        {data.description ? data.description : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading">
                        {data.date ? data.date : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading">
                        {data.category ? data.category : "Not Added"}
                      </h3>
                    </React.Fragment>
                  </div>
                </div>
                <br />
              </div>
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
                          <FaImages /> &nbsp;{" "}
                          {language === "hindi" ? "Images" : "तस्वीरें"}
                        </div>
                      }
                      {...a11yProps(0)}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <div className="regular-view-images-div">
                    {Array.isArray(data.images) &&
                      data.images.map((imgPath, index) => {
                        const modifiedPath = imgPath.substring(
                          imgPath.indexOf("public/") + "public/".length
                        );
                        const imageUrl = `/${modifiedPath}`;

                        return <img key={index} src={imageUrl} alt="" />;
                      })}
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

export default FullViewAnnouncement;
