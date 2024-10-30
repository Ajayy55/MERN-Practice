import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Private() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let isUserLoggedIn = localStorage.getItem("data") !== null;
const navigate=useNavigate()
const location= useLocation()
  useEffect(() => {
    if (isUserLoggedIn) {
      const timer = setTimeout(() => {
        localStorage.removeItem("data");
        alert("You have been logged out due to inactivity.");
        window.location.href = "/login"; 
      }, 3 * 60 * 60 * 1000); 
      return () => clearTimeout(timer);
    }
  }, [isUserLoggedIn]);
 
  return (
    <>
      {isUserLoggedIn ? (
        <div>
          <Outlet />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
   
    </>
  );
}

export default Private;

