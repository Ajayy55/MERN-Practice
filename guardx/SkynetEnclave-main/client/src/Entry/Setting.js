import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import axios from "axios";
import { PORT } from "../Api/api";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LanguageContext } from "../lib/LanguageContext";
const Setting = () => {
  const { language } = useContext(LanguageContext);
  const [auth, setAuth] = React.useState(true);
  const [guardData, setGuardData] = useState({});

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const getGuardId = JSON.parse(localStorage.getItem("guardId"));
  const guardName = JSON.parse(localStorage.getItem("guardName"));
  const id = JSON.parse(localStorage.getItem("guardId"));
  const guardImage = guardData.image?.replace("public/", "");
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
    if (guardName) {
      navigate("/profileSetting");
    }
  };
  const handleEntriesFunctionlaity = () => {};
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();
  const handleLogoutFunctionlaity = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
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
              guardId: getGuardId,
              clockInTime: currentTime,
              clockOutTime: null,
            });
            localStorage.clear();
            window.location.reload();
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } catch (error) {
            console.error("Error logging in guard:", error);
          }
        };

        guardLogin();
      }
    });
  };
  const handleAttendanceFunctionlaity = () => {
    navigate("/showAttendance");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
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
              <Tooltip
                title={
                  language === "english" ? "खाता सेटिंग्स" : "Account Settings"
                }
                arrow
              >
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 45, height: 45 }}>
                    <div className="heading_profile_main">
                      {guardData.image ? (
                        guardData.image && (
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
                            
                                  <b className="setting_icon">{initials}</b>
                              
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
                {language === "english" ? "मेरी उपस्थिति" : "  My attendance  "}
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
    </div>
  );
};

export default Setting;
