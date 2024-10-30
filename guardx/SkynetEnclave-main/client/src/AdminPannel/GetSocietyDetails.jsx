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
import { MdEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { MdOutlineAppRegistration } from "react-icons/md";
import SocietyUser from "./SocietyUser/SocietyUser/SocietyUser";
import { MdLocalPhone } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { FiMap } from 'react-icons/fi';
import { MdPlace } from 'react-icons/md';

const GetSocietyDetails = ({ item }) => {
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
  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <div onClick={toggleDrawer(anchor, true)}>
            <h5 className=" mt-3 house-view-icon ">
              <IoEyeSharp
                data-toggle="tooltip"
                className="eyes_view"
                data-placement="top"
              />
            </h5>
          </div>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            className="show-top"
            sx={{
              width: "100vw",
              maxWidth: "100vw",
            }}
          >
            <div className="heading_user">
              <div
                className="society-view-details-close-icon"
                onClick={toggleDrawer(anchor, false)}
              >
                <IoMdClose className="close_icons" />
              </div>
            </div>
            <hr className="hr_line" />
            <List>
              <div className="society-view-details-main-div">
                <div className="society-view-details-top-heading">
                  <div className="top-society-images-heading-icon-div">
                    <TbListDetails />
                    &nbsp;
                    {language === "hindi"
                      ? " Society Details"
                      : " सोसायटी विवरण"}
                  </div>
                </div>
                <div className="main_content_div">
                  <div className="content2_left_div">
                    <h3 className="house_title_left">
                      <FaUser />
                      &nbsp;{" "}
                      {language === "hindi"
                        ? " Society Name"
                        : " सोसायटी का नाम"}
                    </h3>
                    <h3 className="house_title_left">
                      <MdOutlineAppRegistration />
                      &nbsp;{" "}
                      {language === "hindi"
                        ? " Registration No."
                        : "पंजीकरण नं."}
                    </h3>
                    <h3 className="house_title_left">
                      <FaAddressCard />
                      &nbsp;{language === "hindi" ? " Address " : " पता"}
                    </h3>
                    <h3 className="house_title_left">
                      <FiMap />
                      &nbsp;{language === "hindi" ? " State " : " राज्य"}
                    </h3>
                    <h3 className="house_title_left">
                      <MdPlace />
                      &nbsp;{language === "hindi" ? " City " : " शहर"}
                    </h3>
                    <h3 className="house_title_left">
                      <MdLocalPhone />
                      &nbsp; {language === "hindi" ? " Contact " : " संपर्क"}
                    </h3>
                  </div>
                  <div className="content2_right_div">
                    <React.Fragment key={item.id}>
                      <h3 className="house_title_left">{item.name}</h3>
                      <h3 className="house_title_left">
                        {item.societyRegistration
                          ? item.societyRegistration
                          : "Not Added!"}
                      </h3>
                      <h3 className="house_title_left">{item.address}</h3>
                      <h3 className="house_title_left">{item.state}</h3>
                      <h3 className="house_title_left">{item.city}</h3>
                      <h3 className="house_title_left">
                        {item.societyContactNumber}
                      </h3>
                      <h3 className="house_title_left">
                        {item.alternateNumber}
                      </h3>
                    </React.Fragment>
                  </div>
                </div>
              </div>
              <SocietyUser data={item._id} />
            </List>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default GetSocietyDetails;
