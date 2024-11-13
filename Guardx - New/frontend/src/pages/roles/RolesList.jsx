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
function RolesList() {  
    const [rolesData,setRolesData]=useState([])

    const fetchRolesList=async()=>{
          try {
              const admin=localStorage.getItem('user')
              const url=`${PORT}getUserRoles/${admin}`
              const response=await axios.get(url)
              if(response.status==200){
                  setRolesData(response.data.response)
              }
            //   console.log('users list ',response.data.response);
              
          } catch (error) {
              console.log(error);
          }
    }
//   console.log(rolesData);
  
    useEffect(()=>{
      fetchRolesList();
    },[])
    const navigate = useNavigate();
    const { hasPermission } = usePermissions();
  
    const handleEdit = (id) => {
      navigate(`/editRoles`, { state: id });
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
              const response = axios.delete(`${PORT}removeUserRole/${id}`)
              .then((response)=>{
                  if (response.status == 200) {
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "User removed successfully",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      fetchRolesList();
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
          {hasPermission("Roles", "Read") ? (
            <div className="card-body">
              <div className="card-title d-flex justify-content-between">
                {hasPermission("Roles", "Create") ? (
                  <Link
                    to="/addRoles"
                    className="btn"
                    style={customButtonStyle}
                  >
                    {" "}
                    <i className="mdi mdi-plus-box" /> Add Roles
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
                      <th> Title</th>
                      <th> Decription </th>
                      <th> RoleType </th>
                      <th> Actions </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesData.length > 0 &&
                      rolesData?.map((role) => {
                        return (<tr key={role._id}>
                            {/* Email */}
                            <td> {role.title} </td>
                            {/* contact */}
                            <td >{role.desc}</td>
                            {/* Date */}
                            <td className="text-capitalize">
                             {role?.roleType}
                            </td>
                            <td>
                              <div className="">
                                {/* {hasPermission('Users', 'Read')?( <i className="mdi mdi-eye" data-bs-toggle="tooltip" title="View"></i>):""} */}
                                {hasPermission("Roles", "Edit") ? (
                                  <i
                                    className="mdi mdi-lead-pencil pe-4"
                                    data-bs-toggle="tooltip"
                                    title="Edit"
                                    onClick={() => handleEdit(role._id)}
                                  ></i>
                                ) : (
                                  ""
                                )}
                                {hasPermission("Roles", "Delete") ? (
                                  <i
                                    className="mdi mdi-delete"
                                    data-bs-toggle="tooltip"
                                    title="Delete"
                                    onClick={() => handleDelete(role._id)}
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

  )
}

export default RolesList
