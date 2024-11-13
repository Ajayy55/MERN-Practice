import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { PORT } from "../../port/Port";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usePermissions } from "../../context/PermissionsContext";

const customButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 11px",
  cursor: "pointer",
  borderRadius: "5px",
  display: "inline-block",
  textAlign: "center",
  // width: "10%",
};

function SocietyList() {
  const { hasPermission } = usePermissions();

  const [societyData, setSocietyData] = useState([]);
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const navigate = useNavigate();
  const fetchSocieties = async () => {
    try {
      const url = `${PORT}getSocietyBycreatedBy/${decode.id}`;
      const response = await axios.get(url);
      if (response) {
        // console.log(response);
        const soceity = response?.data?.response;
        setSocietyData(soceity);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editSociety`, { state: id });
  };

  const handleDelete = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          // Swal.fire({
          //   title: "Deleted!",
          //   text: "Your file has been deleted.",
          //   icon: "success"
          // });
          try {
            const response = axios.delete(`${PORT}removeSociety/${id}`)
            .then((response)=>{
                if (response.status == 200) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "Society removed successfully",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    fetchSocieties();
                  }
            })
            
          }catch (error) {
            console.log(error);
          }
        }
      });
 
  };

  return (
    <>
      <Layout>
        <div class="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              {hasPermission("Society List", "Read") ? (
                <div className="card-body">
                  <div className="card-title d-flex justify-content-between">
                    {hasPermission("Society List", "Create") ? (
                      <Link
                        to="/addSociety"
                        className="btn"
                        style={customButtonStyle}
                      >
                        {" "}
                        <i className="mdi mdi-plus-box" /> Add Society
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    <div>
                      {" "}
                      <input type="text" placeholder="Search ..." />
                    </div>
                  </div>
                  {/* </p> */}
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th> Society Name </th>
                          <th> Address </th>
                          <th> Contact Number </th>
                          <th> Date & Time </th>
                          <th> Actions </th>
                        </tr>
                      </thead>
                      <tbody>
                        {societyData.length > 0 &&
                          societyData?.map((single) => {
                            return (
                              <tr key={single._id}>
                                <td className="py-1">
                                  <img
                                    src="../../assets/images/faces-clipart/pic-1.png"
                                    alt="image"
                                    className="me-2"
                                  />{" "}
                                  {single.name}
                                </td>
                                {/* Address */}
                                <td> {single.address} </td>
                                {/* contact */}
                                <td>{single.contact}</td>
                                {/* Date */}
                                <td>
                                  {new Date(single.createdAt).toLocaleString(
                                    "en-IN",
                                    { timeZone: "Asia/Kolkata" }
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-between">
                                    {hasPermission("Society List", "Read") ? (
                                      <i
                                        className="mdi mdi-eye"
                                        data-bs-toggle="tooltip"
                                        title="View"
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    {hasPermission("Society List", "Edit") ? (
                                      <i
                                        className="mdi mdi-lead-pencil"
                                        data-bs-toggle="tooltip"
                                        title="Edit"
                                        onClick={() => handleEdit(single._id)}
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    {hasPermission("Society List", "Delete") ? (
                                      <i
                                        className="mdi mdi-delete"
                                        data-bs-toggle="tooltip"
                                        title="Delete"
                                        onClick={() => handleDelete(single._id)}
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-danger">
                  You Dont have Access to View This Page ...! / UnAuthorized .
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SocietyList;
