import "../css2/all.css";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./nav.css";
import "./accordianmaid.css";
import { MdDashboard } from "react-icons/md";
import Swal from "sweetalert2";
import { MdPermIdentity } from "react-icons/md";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { GrDocumentVerified } from "react-icons/gr";
import { IoGitPullRequestOutline } from "react-icons/io5";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaHouseUser } from "react-icons/fa";
import { BsDiagram2Fill } from "react-icons/bs";
import { DataContext } from "../lib/DataContext";
import { LanguageContext } from "../lib/LanguageContext";
import { FaChevronDown } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuCalendarClock } from "react-icons/lu";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { MdCalendarMonth } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
import { AiOutlineSync } from "react-icons/ai";
import { AiOutlineSchedule } from "react-icons/ai";
import { AiOutlineBulb } from "react-icons/ai";
import { AiOutlineAlert } from "react-icons/ai";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdAnnouncement } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { Tooltip } from "@mui/material";

const AdminNavbar = () => {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const { data } = useContext(DataContext);
  const [activeItemId, setActiveItemId] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const handleRegularEntries = (id) => {
    setActiveItemId(id);
    navigate(`/admin/regular/${id}`);
  };
  useEffect(() => {
    const checkTokenExpiration = () => {
      const data = JSON.parse(localStorage.getItem("data"));

      if (data) {
        const { token, expiresAt } = data;
        const now = new Date().getTime();

        if (now >= expiresAt) {
          localStorage.removeItem("data");
          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired due to inactivity. Please log in again.",
            confirmButtonText: "OK",
          }).then(() => {
            localStorage.clear();
            navigate("/login");
          });
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000);

    return () => clearInterval(interval);
  }, [navigate]);
  const [expanded, setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  // Set societyLogo Functionlaity
  const { societyDetails } = useContext(DataContext);
  const roleType = JSON.parse(localStorage.getItem("role"));
  //Calender Functionality
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
    setIsAttendanceActive(true);
  };
  const handleDropdownItemClick = (e) => {
    e.stopPropagation();
  };
  React.useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/admin/calender")) {
      setIsSubmenuOpen(true);
    } else {
      setIsSubmenuOpen(false);
    }
  }, [location]);

  const handleClick = (id) => {
    setActiveItemId(id);
    handleRegularEntries(id);
  };
  return (
    <>
      <aside
        className="sidenav bg-white navbar navbar-vertical  border-0 border-radius-xl my-3 fixed-start ms-4 "
        id="sidenav-main"
      >
        <div className="sidenav-header">
          <i
            className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
          ></i>
          <a className="navbar-brand m-0 text-center" target="_blank">
            {roleType === 1 || roleType === 2 ? (
              <div className="guard_logo_div ">
                <img src="/GuardX.png" alt="" className="" />
                &nbsp;&nbsp; &nbsp;&nbsp;{" "}
                <b>{language === "hindi" ? "  Welcome" : "स्वागत"}</b>
              </div>
            ) : (
              <div className="society_logo_div">
                <img
                  src={`/${societyDetails?.societyLogo?.replace(
                    "public/",
                    ""
                  )}`}
                  alt=""
                  className="society-logo-on-nav"
                />

                <b>{language === "hindi" ? "  Welcome" : "स्वागत"}</b>
              </div>
            )}
            <span className="ms-1 font-weight-bold"></span>
          </a>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="side-nav-main-div">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link " to="/admin/dashboard">
                <div className="icon icon-shape icon-sm border-radius-md text-center ms-2  ">
                  <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                </div>
                <span className="nav-link-text text-start">
                  <MdDashboard className="icon_font_size" />

                  <span className="nav-module-right">
                    &nbsp; {language === "hindi" ? " Dashboard" : " डैशबोर्ड"}
                  </span>
                </span>
              </NavLink>
            </li>

            {permissions[6]?.actions.module && (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/society-details">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ">
                    <BsFillBuildingsFill className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp; {language === "hindi" ? " Society" : "सोसाइटी"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}

            {permissions[0]?.actions.module && (
              <li className="nav-item mt--3">
                <div>
                  {
                    <Accordion
                      style={{ width: "100%" }}
                      expanded={data.length > 0 ? expanded : ""}
                      sx={{
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      }}
                      onChange={handleToggle}
                      // className="accordian_style_setting"
                    >
                      <AccordionSummary
                        expandIcon={
                          <FaChevronDown className="accordion-icon" />
                        }
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                          <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                        </div>
                        <span className="nav-link-text change_color_regular_side text-start">
                          <GrDocumentVerified />
                          &nbsp;&nbsp;
                          <span className="nav-module-right">
                            &nbsp;{" "}
                            {language === "hindi"
                              ? "Regular Entries"
                              : "नियमित प्रविष्टियाँ"}
                          </span>
                        </span>
                      </AccordionSummary>
                      <div className="regular_title_content">
                        {
                          <div
                            className={
                              data.length > 15
                                ? "dropDown_regular_title"
                                : "regular_ul"
                            }
                          >
                            <ul className="ul_navlink">
                              {data.map((item) => {
                                if (item?.entryType === "Regular") {
                                  return (
                                    <div
                                      key={item.id}
                                      className="regular_entry_div"
                                    >
                                      <li
                                        onClick={() =>
                                          handleRegularEntries(item._id)
                                        }
                                        className={`${
                                          item._id === activeItemId
                                            ? "active_item"
                                            : ""
                                        }`}
                                      >
                                        &nbsp; &nbsp;&nbsp;
                                        {item?.icon?.length > 0 ? (
                                          <img
                                            src={`/${item.icon.replace(
                                              "public/",
                                              ""
                                            )}`}
                                            alt=""
                                            height="30px"
                                            className="img-regular-section"
                                          />
                                        ) : (
                                          <div className="entry_placeholder_for_sidenavbar">
                                            <div className="logo-regular-section">
                                              <h6>
                                                {item.titleEnglish
                                                  .split(" ")[0]
                                                  .substring(0, 1)
                                                  .toUpperCase()}
                                              </h6>
                                            </div>
                                          </div>
                                        )}
                                        <Tooltip
                                          title={item.titleEnglish}
                                          placement="top"
                                          arrow
                                        >
                                          {item.titleEnglish.length > 20
                                            ? item.titleEnglish.substring(
                                                0,
                                                19
                                              ) + "..."
                                            : item.titleEnglish}
                                        </Tooltip>
                                      </li>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </ul>
                          </div>
                          // )
                        }
                      </div>
                    </Accordion>
                  }
                </div>
              </li>
            )}

            {permissions[1]?.actions.module && (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/home">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms--2 text-start">
                    <IoGitPullRequestOutline className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp;{" "}
                      {language === "hindi"
                        ? "Guest Entries Requests"
                        : " अतिथि प्रविष्टि अनुरोध"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}

            {permissions[2]?.actions.module && (
              //  (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/entry-type">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text ms--2 text-start">
                    <AiOutlineSchedule className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp;{" "}
                      {language === "hindi"
                        ? "Type of Entries"
                        : "प्रविष्टियों का प्रकार"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}
            {permissions[3]?.actions.module && (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/purpose-type">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text  ms--2 text-start">
                    <AiOutlineBulb className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp;{" "}
                      {language === "hindi"
                        ? " Purpose of Occasional"
                        : "अवसर का उद्देश्य"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}

            {permissions[4]?.actions.module && (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/house-data">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text  ms--2 text-start">
                    <AiOutlineHome className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp; {language === "hindi" ? "House List" : "घर सूची"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}

            {permissions[9]?.actions.module && (
              <li className="nav-item">
                <div
                  className="nav-link"
                  onClick={toggleSubmenu}
                  style={{ cursor: "pointer" }}
                >
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text  text-start">
                    <FaRegCalendarAlt className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp; {language === "hindi" ? "Attendance" : "उपस्थिति "}
                    </span>
                  </span>
                </div>
              </li>
            )}

            {isSubmenuOpen && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    onClick={handleDropdownItemClick}
                    to="/admin/calender/daily"
                  >
                    <span className="nav-link-text ms-5">
                      <LuCalendarClock className="icon_font_size" />{" "}
                      &nbsp;&nbsp;{" "}
                      {language === "english" ? " दैनिक " : "Daily "}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    onClick={handleDropdownItemClick}
                    to="/admin/calender/weekly"
                  >
                    <span className="nav-link-text ms-5">
                      <LiaCalendarWeekSolid className="icon_font_size" />
                      &nbsp;&nbsp;{" "}
                      {language === "english" ? "  साप्ताहिक " : "Weelky"}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    onClick={handleDropdownItemClick}
                    to="/admin/calender/monthly"
                  >
                    <span className="nav-link-text ms-5">
                      <MdCalendarMonth className="icon_font_size" />{" "}
                      &nbsp;&nbsp;{" "}
                      {language === "english" ? "मासिक" : "Monthly"}
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {roleType === 4 ? (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/viewAnnouncement">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text  ms--2 text-start">
                    <FaRegBell className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp; {language === "hindi" ? "Announcements" : "घोषणा"}
                    </span>
                  </span>
                </NavLink>
              </li>
            ) : null}

            {permissions[7]?.actions.module && (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/showUser">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text  ms--2 text-start">
                    <AiOutlineUserAdd className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp;{language === "hindi" ? " Users" : "उपयोगकर्ता"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}

            {permissions[5]?.actions.module && (
              <li className="nav-item">
                <NavLink className="nav-link " to="/admin/readRoles">
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                  </div>
                  <span className="nav-link-text  ms--2 text-start">
                    <AiOutlineUserSwitch className="icon_font_size" />

                    <span className="nav-module-right">
                      &nbsp;{language === "hindi" ? " Roles" : "भूमिकाएँ"}
                    </span>
                  </span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AdminNavbar;
