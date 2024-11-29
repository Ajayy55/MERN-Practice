import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import BackButton from '../utils/BackButton'
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { usePermissions } from '../../context/PermissionsContext';
import './../../App.css'
import { PORT } from "../../port/Port";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';

const customButtonStyle= {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 11px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "inline-block",
    textAlign: "center",
  }

function RegularEntries() {

  const [RegularEntryList, setRegularEntryList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 10; // Items per page
  const [flag,setFlag]=useState(false)
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const location=useLocation();
  const entry=location.state;

  const fetchSocietyRegularEntryById = async (society,entry) => {
    try {
      const url = `${PORT}getSocietyRegularEntryById`;
      const response = await axios.post(url,{society,entry});
      // console.log(response);

      if (response.status === 200) {
        setRegularEntryList(response.data.response);
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
          fetchSocietyRegularEntryById(decoded.society,entry._id); // Pass the society ID
        } else {
          console.error("No society ID found in token.");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [flag,entry]); 


  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = RegularEntryList.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.aadhaarNumber?.toLowerCase().includes(query)||
        user.mobile?.toLowerCase().includes(query)
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
          axios.delete(`${PORT}removeRegularEntry/${id}`).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: response?.data?.message || "Regular Entry Removed Successfully",
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
  const handleEdit = (entry) => {
    // console.log(house);
    
    navigate(`/viewRegularEntry`, { state: entry });
  };
  const handleApprove=()=>{
  }
   
    // console.log('ssds',entry);
    
    const handleAddRegularEntry=(entry)=>{
        navigate("/addRegularEntry",{state:{_id:entry._id,title:entry.title}})
    }


  return (
    <>
    <Layout>
    <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
            {hasPermission("Regular Entries", "Read") ? (
              <div className="card-body">
                <div className="card-title d-flex justify-content-between">
                  {hasPermission("Regular Entries", "Create") && (
                    <span className="btn "style={customButtonStyle} onClick={()=>{handleAddRegularEntry(entry)}}>
                      <i className="mdi mdi-plus-box" /> Add {entry?.title}
                    </span>
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
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Aadhar</th>
                        <th>contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEntries.length > 0 && paginatedEntries.map((entry) => {
                       return <tr key={entry._id}>
                          <td className="py-1 text-capitalize">
                            <img
                              src={entry?.regularProfileImage ? `${PORT}${entry.regularProfileImage?.split("public")[1]}`:"../../assets/images/faces-clipart/pic-1.png"}
                              alt="user avatar"
                              className="me-2"
                            />
                            {entry.name}
                          </td>
                          <td>{entry.gender ? entry?.gender:<span className="px-5" > -</span>}</td>
                          <td>{entry.aadhaarNumber ? entry?.aadhaarNumber:<span className="px-3" > -</span>}</td>
                          <td>{entry.mobile ? entry?.mobile:<span className="px-3" > -</span>}</td>
                         
                          <td>
                            <div>
                            {/* {hasPermission("Regular Entries", "Edit") &&(
                                <i
                                  className="mdi mdi-fingerprint pe-3"
                                  data-bs-toggle="tooltip"
                                  title="Attendance"
                                  onClick={() => handleEdit(entry)}
                                  style={{ cursor: "pointer" }}
                                />
                              )} */}
                              {hasPermission("Regular Entries", "Edit") && (
                                <i
                                  className="mdi mdi-lead-pencil pe-3"
                                  data-bs-toggle="tooltip"
                                  title="View / Edit"
                                  onClick={() => handleEdit(entry)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {hasPermission("Regular Entries", "Delete") && (
                                <i
                                  className="mdi mdi-delete"
                                  data-bs-toggle="tooltip"
                                  title="Delete"
                                  onClick={() => handleDelete(entry._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      })}
                      {paginatedEntries.length === 0 && RegularEntryList.length === 0 && (
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
                ): (
                    <div className="text-danger">
                      You don't have access to view this page. Unauthorized.
                    </div>
                  )}
        </div>
        </div>
    </div>

  

    </Layout>
    
    </>
  )
}

export default RegularEntries
