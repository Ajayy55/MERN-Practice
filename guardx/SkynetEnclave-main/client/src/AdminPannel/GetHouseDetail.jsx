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
import AddHouseOwnerUser from "./HouseList/AddHouseOwner/AddHouseOwnerUser";
import ListHouseOwnerUser from "./HouseList/ListHouseOwnerUser/ListHouseOwnerUser";
import AddVehicle from "./HouseList/AddHouseOwnerVehicle/AddVehicle";
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
const GetHouseDetail = ({ item, onDataChange, onUserDelete }) => {
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
                <div
                  className="close_btn"
                  onClick={toggleDrawer(anchor, false)}
                >
                  <IoMdClose className="close_icons_house" />
                </div>
              {/* </div> */}
            {/* </div> */}
            <hr className="hr_line" />
            <List>
              <div className="regular-view-main-div">
                <div className="regular-images-view-title">
                  {" "}
                  {language === "hindi"
                    ? "House Owner Details"
                    : "मकान मालिक का विवरण"}
                </div>
                <div className="main_content_div">
                  <div className="content1_left_div ">
                    <h3 className="house_title_left">
                      <FaHouseUser />
                      &nbsp; {language === "hindi" ? "House No. " : "घर संख्या"}
                    </h3>
                    <h3 className="house_title_left">
                      <FaAddressCard />
                      &nbsp;{language === "hindi" ? "Block No." : "ब्लॉक नं."}
                    </h3>
                    <h3 className="house_title_left">
                      <FaUser />
                      &nbsp; {language === "hindi" ? "Owner Name " : "नाम"}
                    </h3>

                    <h3 className="house_title_left">
                      <MdContactPhone />
                      &nbsp;{language === "hindi" ? "Contact " : " संपर्क"}
                    </h3>

                    <h3 className="house_title_left">
                      <FaAddressCard />
                      &nbsp;{language === "hindi" ? "Aadhar No." : " आधार नं."}
                    </h3>
                  </div>
                  <div className="content1_right_div">
                    <React.Fragment key={item.id}>
                      <h3 className="user_images_heading">
                        {item.houseNo ? item.houseNo : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading">
                        {item.blockNumber ? item.blockNumber : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading">
                        {item.ownerName ? item.ownerName : "Not Added"}
                      </h3>

                      <h3 className="user_images_heading">
                        {item.userPhoneNo ? item.userPhoneNo : "Not Added"}
                      </h3>

                      <h3 className="user_images_heading">
                        {item && item.aadhaarNumber
                          ? item.aadhaarNumber
                          : "Not Added"}
                      </h3>
                    </React.Fragment>
                  </div>
                </div>
                <br />
                <div className="regular-images-view-title">
                  {" "}
                  {language === "hindi"
                    ? "Login Details"
                    : "मकान मालिक का विवरण"}
                </div>
                <div className="main_content_div">
                  <div className="content1_left_div ">
                    <h3 className="house_title_left">
                      <MdEmail />
                      &nbsp;
                      {language === "hindi"
                        ? " Login Email  "
                        : "सोसायटी उपयोगकर्ता ईमेल"}
                    </h3>
                    <h3 className="house_title_left">
                      <TbPasswordUser />
                      &nbsp;
                      {language === "hindi"
                        ? "Login Password "
                        : "सोसायटी उपयोगकर्ता पासवर्ड"}{" "}
                    </h3>
                    <h3 className="house_title_left">
                      <TbPasswordUser />
                      &nbsp;
                      {language === "hindi"
                        ? "Is this an RWA member? "
                        : "RWA सदस्य हैं?"}{" "}
                    </h3>
                  </div>
                  <div className="content1_right_div">
                    <React.Fragment key={item.id}>
                      <h3 className="user_images_heading">
                        {item && item.username ? item.username : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading">
                        {item && item.password ? item.password : "Not Added"}
                      </h3>
                      <h3 className="user_images_heading">
                        {item && item.isRwaMember
                          ? item.isRwaMember
                          : "Not Added"}
                      </h3>
                    </React.Fragment>
                  </div>
                </div>
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
                          <FaHouseUser /> &nbsp;{" "}
                          {language === "hindi"
                            ? "Add House Owner"
                            : "मकान मालिक जोड़ें"}
                        </div>
                      }
                      {...a11yProps(0)}
                    />

                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                          <FaImages /> &nbsp;{" "}
                          {language === "hindi"
                            ? "House Owner Images"
                            : " घर के मालिक की तस्वीरें"}
                        </div>
                      }
                      {...a11yProps(1)}
                    />

                    <Tab
                      label={
                        <div className="top-heading-label-title">
                          {/* <IoAddSharp  className="top-heading-label-icon"/> */}
                          <FaCar /> &nbsp;{" "}
                          {language === "hindi"
                            ? "Add Vehicle "
                            : "वाहन जोड़ें "}
                        </div>
                      }
                      {...a11yProps(2)}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  {item && item.username && item && item.password ? null : (
                    <AddHouseOwnerUser
                      data={item._id}
                      onDataChange={onDataChange}
                    />
                  )}
                  {item && item.username && item && item.password ? (
                    <ListHouseOwnerUser data={item} userDelete={onUserDelete} />
                  ) : null}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <div className="regular-view-images-div">
                    {Array.isArray(item.ownerImages) &&
                      item.ownerImages.map((imgPath, index) => {
                        const modifiedPath = imgPath.substring(
                          imgPath.indexOf("public/") + "public/".length
                        );
                        const imageUrl = `/${modifiedPath}`;

                        return <img key={index} src={imageUrl} alt="" />;
                      })}
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <AddVehicle data={item._id} />
                </CustomTabPanel>
              </Box>
            </List>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default GetHouseDetail;
