import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import axios from "axios";
import { PORT } from "../Api/api";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AiOutlineUser } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { LuCopyCheck } from "react-icons/lu";
import { IoIosSettings } from "react-icons/io";
import Typography from "@mui/material/Typography";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./adminsetting.css";
import { LanguageContext } from "../lib/LanguageContext";
const AdminSetting = (data) => {
  const { language } = useContext(LanguageContext);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const handleClose = () => {
    setAnchorEl(null);
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
         className:"swal-on-top"
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

  const listItems = [
    {
      text: language === "english" ? "प्रोफाइल" : " Profile ",
      icon: <IoIosSettings className="list_icon" />,
      action: handleSettingFunctionality,
    },
    {
      text: language === "english" ? "मेरी उपस्थिति" : "  My Attendance  ",
      icon: <LuCopyCheck className="list_icon" />,
      action: handleAttendanceFunctionlaity,
    },
    {
      text: language === "english" ? "लॉगआउट" : "  Logout ",
      icon: <IoIosLogOut className="list_icon" />,
      action: handleLogoutFunctionlaity,
    },
  ];

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
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
                    initials = words[0].substring(0, 1).toUpperCase();
                  }
                }
                return (
                  <>
                    <div className="heading_profile_div">
                      <div className="heading_profile">
                        <b>{initials}</b>
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </Typography>
      <List>
        {listItems.map(({ text, icon, action }, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={action ? action : null}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <React.Fragment key="right">
        <Button onClick={toggleDrawer("right", true)} className="button_icon">
          <FaUserAlt className="aiuser_icon" />
        </Button>
        <div>
          <Drawer
            className="drawer-off"
            anchor="right"
            open={state.right}
            onClose={toggleDrawer("right", false)}
            sx={{ width: 150 }}
          >
            {list("right")}
          </Drawer>
        </div>
      </React.Fragment>
    </div>
  );
};

export default AdminSetting;
