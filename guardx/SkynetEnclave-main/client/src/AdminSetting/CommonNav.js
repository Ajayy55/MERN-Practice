import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { PORT } from "../Api/api";
import axios from "axios";
import "./profile.css";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import LanguageTranslation from "../Navbar/LanguageTranslation";
const CommonNav = () => {
  const { language, handleLanguageChange } = useContext(LanguageContext);
  //ProfileSetting
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [auth, setAuth] = React.useState(true);
  const [guardData, setGuardData] = useState({});
  const guardImage = guardData?.Ownerimage?.replace("public/", "");
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  useEffect(() => {
    const getGuardData = async () => {
      try {
        const response = await axios.get(
          `${PORT}/getEditWithSocietyUnion/${id}`
        );
        setGuardData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching guard data:", error);
      }
    };
    getGuardData();
  }, []);

  const handleSettingFunctionality = () => {
    // if(guardName){
    navigate("/admin/profilesetting");
    // }
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("roleId"));
  const handleLogoutFunctionlaity = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      className: "swal-on-top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const getCurrentTime = () => {
          const now = new Date();
          let hours = now.getHours();
          const amOrPm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const minutes = now.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes} ${amOrPm}`;
        };

        const guardLogin = async () => {
          try {
            const currentTime = getCurrentTime();
            const response = await axios.post(`${PORT}/guardLogin`, {
              guardId:id,
              createdBy: id,
              clockInTime: currentTime,
              clockOutTime: null,
            });
            localStorage.clear();
            navigate("/login");
          } catch (error) {
            console.error("Error logging in guard:", error);
          }
        };

        guardLogin();
      }
    });
  };
  const handleAttendanceFunctionlaity = () => {
    navigate("/admin/attendance");
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleSideNavToggleFunctionality = () => {
    const sideNav = document.getElementById("sidenav-main");

    if (window.innerWidth <= 1024) {
      if (sideNav) {
        sideNav.classList.toggle("hidden");
      } else {
        console.error('Element with ID "sidenav-main" not found.');
      }
    }
  };

  // Optional: Add an event listener to handle resizing and adjust visibility
  window.addEventListener("resize", () => {
    const sideNav = document.getElementById("sidenav-main");

    if (window.innerWidth > 1024 && sideNav) {
      sideNav.classList.remove("hidden");
    }
  });
  return (
    <>
      <ul className="navbar-nav  justify-content-end">
        <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
          <a
            onClick={handleSideNavToggleFunctionality}
            className="nav-link text-white p-0"
            id="iconNavbarSidenav"
          >
            <div className="sidenav-toggler-inner">
              <i className="sidenav-toggler-line bg-white"></i>
              <i className="sidenav-toggler-line bg-white"></i>
              <i className="sidenav-toggler-line bg-white"></i>
            </div>
          </a>
        </li>

        <div className="language_translation_div">
          <div className="lang">
            <div className="switch">
              <input
                id="language-toggle"
                checked={language === "hindi"}
                onChange={() => handleLanguageChange()}
                className="check-toggle check-toggle-round-flat-dashboard"
                type="checkbox"
              />
              <label className="lang-cng" htmlFor="language-toggle"></label>
              <span className="on">HI</span>
              <span className="off">EN</span>
            </div>
          </div>
        </div>
        <li className="nav-item d-flex align-items-center">
          <div>
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 47, height:47 }} className="avatar-admin">
                      {/* // setImage Fucntionlaity */}
                      <div className="heading_profile_main">
                        {guardData.Ownerimage ? (
                          guardData.Ownerimage && (
                            <div className="heading_profile">
                              <img src={`/${guardImage}`} alt="" />
                            </div>
                          )
                        ) : (
                          <>
                            {(() => {
                              let initials = "";

                              if (guardData?.username) {
                                const words = guardData.username.split(" ");
                                if (words.length > 0) {
                                  initials = words[0]
                                    .substring(0, 1)
                                    .toUpperCase();
                                }
                              }
                              return (
                                <>
                                  <div className="heading_profile_div">
                                    <div className="heading_profile">
                                      <b className="heading_logo">{initials}</b>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{
                  horizontal: "right",
                  vertical: "top",
                }}
                anchorOrigin={{
                  horizontal: "right",
                  vertical: "bottom",
                }}
              >
                <MenuItem onClick={handleSettingFunctionality}>
                  <Avatar /> {language === "english" ? "प्रोफाइल" : " Profile "}
                </MenuItem>
                <MenuItem onClick={handleAttendanceFunctionlaity}>
                  <Avatar />{" "}
                  {language === "english"
                    ? "मेरी उपस्थिति"
                    : "  My Attendance  "}
                </MenuItem>
                <Divider />

                <MenuItem onClick={handleLogoutFunctionlaity}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  {language === "english" ? "लॉगआउट" : "  Logout "}
                </MenuItem>
              </Menu>
            </React.Fragment>
          </div>
        </li>
      </ul>
    </>
  );
};

export default CommonNav;
