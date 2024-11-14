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

function UsersList() {

const [usersData,setUsersData]=useState([])

  const fetchUsersList=async()=>{
        try {
            const admin=localStorage.getItem('user')
            const url=`${PORT}getUsersByCreatedBy/${admin}`
            const response=await axios.get(url)
            if(response.status==200){
                setUsersData(response.data.response)  
            }
            // console.log('users list ',response.data.response);
            
        } catch (error) {
            console.log(error);
        }
  }

  useEffect(()=>{
    fetchUsersList();
  },[])
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const handleEdit = (id) => {
    // navigate(`/editSociety`, { state: id });
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
        //   Swal.fire({
        //     title: "Deleted!",
        //     text: "Your file has been deleted.",
        //     icon: "success"
        //   });
          try {
            const response = axios.delete(`${PORT}removeUser/${id}`)
            .then((response)=>{
                if (response.status == 200) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "User removed successfully",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    fetchUsersList();
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
        <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
            {hasPermission("Users", "Read") ? (
              <div className="card-body">
                <div className="card-title d-flex justify-content-between">
                  {hasPermission("Users", "Create") ? (
                    <Link
                      to="/addUser"
                      className="btn"
                      style={customButtonStyle}
                    >
                      {" "}
                      <i className="mdi mdi-plus-box" /> Add User
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
                        <th> User</th>
                        <th> Email </th>
                        <th> Status </th>
                        <th> Role </th>
                        <th> Actions </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.length > 0 &&
                        usersData?.map((user) => {
                          return (
                            <tr key={user._id}>
                              <td className="py-1 text-capitalize">
                                <img
                                  src="../../assets/images/faces-clipart/pic-1.png"
                                  alt="image"
                                  className="me-2"
                                />{" "}
                                {/* username */}
                               {user.username}
                              </td>
                              {/* Email */}
                              <td> {user.email} </td>
                              {/* contact */}
                              <td >{user.isActive ?<div class="badge badge-outline-success">Active</div> :<div class="badge badge-outline-danger"> In Active </div>}</td>
                              {/* Date */}
                              <td className="text-capitalize">
                               {user?.role?.desc}
                              </td>
                              <td>
                                <div className="">
                                  {/* {hasPermission('Users', 'Read')?( <i className="mdi mdi-eye" data-bs-toggle="tooltip" title="View"></i>):""} */}
                                  {hasPermission("Users", "Edit") ? (
                                    <i
                                      className="mdi mdi-lead-pencil pe-3"
                                      data-bs-toggle="tooltip"
                                      title="Edit"
                                      onClick={() => handleEdit(user._id)}
                                    ></i>
                                  ) : (
                                    ""
                                  )}
                                  {hasPermission("Users", "Delete") ? (
                                    <i
                                      className="mdi mdi-delete"
                                      data-bs-toggle="tooltip"
                                      title="Delete"
                                      onClick={() => handleDelete(user._id)}
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
            ):(
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

export default UsersList;
