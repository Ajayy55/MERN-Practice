import React from "react";
import Swal from "sweetalert2";
function Logout() {
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
      }
    });
  };
  return (
    <>
      <div className="logout">
        <p  onClick={handleLogout}>logout</p>
      </div>
    </>
  );
}

export default Logout;
