
import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { PORT } from "../../port/Port";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usePermissions } from "../../context/PermissionsContext";
import { jwtDecode } from "jwt-decode";

const customButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 11px",
  cursor: "pointer",
  borderRadius: "5px",
  display: "inline-block",
  textAlign: "center",
};

function HouseList() {
  const [HouseList, setHouseList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 10; // Items per page
  const [flag,setFlag]=useState(false)
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const fetchHouseList = async (id) => {
    try {
      const url = `${PORT}getHouseListBySocietyId/${id}`;
      const response = await axios.get(url);
      // console.log(response);

      if (response.status === 200) {
        setHouseList(response.data.response);
        setFilteredData(response.data.response); // Initialize filtered data
      }
    } catch (error) {
      console.error("Error fetching house list:", error);
    }
  };

  useEffect(() => {
    const Token = localStorage.getItem("token"); // Moved here to update dynamically
    if (Token) {
      try {
        const decoded = jwtDecode(Token);
        if (decoded?.society) {
          fetchHouseList(decoded.society); // Pass the society ID
        } else {
          console.error("No society ID found in token.");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [flag]); 


  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = HouseList.filter(
      (user) =>
        user.houseNo?.toLowerCase().includes(query) ||
        user.ownerName?.toLowerCase().includes(query)||
        user.approvalStatus?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const paginatedEntries = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle delete action
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(`${PORT}removeHouse/${id}`).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: response?.data?.message || "House removed successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              setFlag(flag?false:true)
            }
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error", "removing house Failed ..!!", "error");

        }
      }
    });
  };

  // Handle edit action
  const handleEdit = (house) => {
    // console.log(house);
    
    navigate(`/houselist/viewhouse`, { state: house });
  };

  const handleApprove=async(houseId,approvalStatus)=>{
      try {
        const url=`${PORT}handleApprovalStatus`
        const response=await axios.patch(url,{houseId,approvalStatus});
        console.log(response);
        
        if(response.status===200){
          Swal.fire("Success", response?.data?.message || "Approval Status Updated successfully!", "success");
          setFlag(flag?false:true)
        }
        
      } catch (error) {
        console.log("while updating status",error);
        Swal.fire("Error",  error?.response?.data?.message || "Error Occured Updating Approval Status!", "error");

      }
  }


  return (
    // <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            {hasPermission("House List", "Read") ? (
              <div className="card-body">
                <div className="card-title d-flex justify-content-between">
                  {hasPermission("House List", "Create") && (
                    <Link to="addHouse" className="btn" style={customButtonStyle}>
                      <i className="mdi mdi-plus-box" /> Add House
                    </Link>
                  )}
                  <input
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearchInput}
                    className="form-control"
                    style={{ width: "30%", marginLeft: "auto" }}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>House No</th>
                        <th>Block</th>
                        <th>Owner</th>
                        <th>contact</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEntries.length > 0 && paginatedEntries.map((house) => {
                       return <tr key={house._id}>
                          <td className="py-1 text-capitalize">
                            {/* <img
                              src="../../assets/images/faces-clipart/pic-1.png"
                              alt="user avatar"
                              className="me-2"
                            /> */}
                            {house.houseNo}
                          </td>
                          <td>{house.blockNo ? house?.blockNo:<span className="px-5" > -</span>}</td>
                          <td>{house.ownerName ? house?.ownerName:<span className="px-3" > -</span>}</td>
                          <td>{house.mobile ? house?.mobile:<span className="px-3" > -</span>}</td>
                          <td>
                            {house?.approvalStatus==='Pending'&& <div className="badge badge-outline-warning">Pending</div> }
                            {house?.approvalStatus==='Approved'&& <div className="badge badge-outline-success">Approved</div> }
                            {house?.approvalStatus==='Rejected'&& <div className="badge badge-outline-danger">Rejected</div> }
                              
                            {/* : (
                              <div className="badge badge-outline-danger">Inactive</div>
                            )} */}
                          </td>
                          <td>
                            <div>
                            {house?.approvalStatus==='Pending'&&   <i
                                  className="mdi mdi-account-check pe-3"
                                  data-bs-toggle="tooltip"
                                  title="Approve"
                                  onClick={() => handleApprove(house._id,"Approved")}
                                  style={{ cursor: "pointer" }}
                                />}
                            {house?.approvalStatus==='Pending'&& <i
                                  className="mdi mdi-account-remove pe-3"
                                  data-bs-toggle="tooltip"
                                  title="Reject"
                                  onClick={() => handleApprove(house._id,"Rejected")}
                                  style={{ cursor: "pointer" }}
                                /> }

                              {hasPermission("House List", "Edit") && house?.approvalStatus!=='Rejected'&&(
                                <i
                                  className="mdi mdi-lead-pencil pe-3"
                                  data-bs-toggle="tooltip"
                                  title="View / Edit"
                                  onClick={() => handleEdit(house)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {hasPermission("House List", "Delete") && (
                                <i
                                  className="mdi mdi-delete"
                                  data-bs-toggle="tooltip"
                                  title="Delete"
                                  onClick={() => handleDelete(house._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      })}
                      {paginatedEntries.length === 0 && HouseList.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>
                      Showing {paginatedEntries.length} of{" "}
                      {filteredData.length} entries
                    </span>
                    <nav>
                      <ul className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              index + 1 === currentPage ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-danger">
                You don't have access to view this page. Unauthorized.
              </div>
            )}
          </div>
        </div>
      </div>
    // </Layout>
  );
}



export default HouseList
