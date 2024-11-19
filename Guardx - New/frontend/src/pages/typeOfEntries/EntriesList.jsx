import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { PORT } from "../../port/Port";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usePermissions } from "../../context/PermissionsContext";
import TypesOfEntriesModal from "./TypesOfEntriesModal";
import { getSocietyBySocietyID } from "../../lib/society/society";
import BackButton from "../utils/BackButton";


const customButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 11px",
  cursor: "pointer",
  borderRadius: "5px",
  display: "inline-block",
  textAlign: "center",
};

function EntriesList() {
  const { hasPermission ,userRole} = usePermissions();
  const [showModal, setShowModal] = useState(false);
  const [entriesData, setEntriesData] = useState([]);
  const [SocietyEntriesData, setSocietyEntriesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 10; // Items per page

  const fetchSocietyTypeOfEntries=async()=>{
    try {
        // const id='6731880e33cc6e06c07b10eb'
        const response=await axios.get(`${PORT}getTypesOfEntriesOfSociety/${decode.society}`)
        const societyEntries = response?.data?.response.typeOfEntries ||null;
        setSocietyEntriesData(societyEntries);
    } catch (error) {
      console.log(error);
    }
  }
// console.log(SocietyEntriesData);
// console.log('sss',society);

  const fetchTypesOfEntries = async () => {
    try {
      
      const user=localStorage.getItem('user')
      const url = `${PORT}getTypeOfEntriesByCreatedBy`;
      const response = await axios.get(url);
      
      if (response) {
        const entries = response?.data?.response;
        setEntriesData(entries);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTypesOfEntries();
    if(decode.society){
      fetchSocietyTypeOfEntries();
    }
    
  }, [showModal]);

  const handleEdit = (id) => {
    navigate(`/editTypesOfEntry`, { state: id });
  };

  const handleDeleteFromSociety=async(RemoveId)=>{
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
          axios.patch(`${PORT}removeTypeOfEntryFromSociety/${decode.society}`,{RemoveId}).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Entry Removed Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchSocietyTypeOfEntries();
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
    
  }

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
          axios.delete(`${PORT}removeTypeOfEntry/${id}`).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Entry Removed Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchTypesOfEntries();
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
// console.log(entriesData);

  // Filter society data based on search query
  const filteredEntries = 
    userRole?.permissionLevel<=2? 
      entriesData.filter((entry) =>
      entry.title.toLowerCase().includes(searchQuery?.toLowerCase()))
    :
    SocietyEntriesData.filter((entry) =>entry.title.toLowerCase().includes(searchQuery?.toLowerCase()));
    

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);


  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            {hasPermission("Type of Entries", "Read") ? (
              <div className="card-body">
                <div className="card-title d-flex justify-content-between">
               
                  {hasPermission("Type of Entries", "Create") ? (
                       
                        userRole.permissionLevel<=2 ?   //if role <2 Add new roles else add roles prevoius added by admin
                          ( <Link
                          to="/addTypesOfEntry"
                          className="btn"
                          style={customButtonStyle}
                        >
                          <i className="mdi mdi-plus-box" /> Add Entry
                        </Link>) : (   <div>            
                                  <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{background:'#4CAF50'}}>
                                    Add Types of Entries
                                  </button>

                                  <TypesOfEntriesModal
                                    show={showModal}
                                    onClose={() => setShowModal(false)}
                                    entries={entriesData}
                                    id={decode.society}
                                  />
                                </div>)
                        
                  ) : (
                    <div></div>
                  )}
                  <div>
                    <input
                      type="text"
                      placeholder="Search Entry ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> Logo</th>
                        <th> Title </th>
                        <th> Type </th>
                        <th> Date </th>
                        <th> Actions </th>
                      </tr>
                    </thead>
                    <tbody>
                    {paginatedEntries.length > 0 ? (
                      paginatedEntries.map((single) => (
                          <tr key={single._id}>
                            <td className="py-1 ">
                              <img
                                src={`${PORT}${single.icon.split('public')[1]}`||"../../assets/images/faces-clipart/pic-1.png"}
                                alt="image"
                                className="me-2"
                              />{" "}
                              {/* {single.title} */}
                            </td>
                            <td className="text-capitalize"> {single.title} </td>
                            <td className="text-capitalize">{single.entryType}</td>
                            <td>
                              {new Date(single.createdAt).toLocaleDateString(
                                "en-IN",
                                { timeZone: "Asia/Kolkata" }
                              )}
                            </td>
                            <td>
                              <div>
                           
                                {hasPermission("Type of Entries", "Edit") && userRole.permissionLevel<=2 &&(
                                  <i
                                    className="mdi mdi-lead-pencil me-4"
                                    data-bs-toggle="tooltip"
                                    title="Edit"
                                    onClick={() => handleEdit(single._id)}
                                  ></i>
                                )}
                                {hasPermission("Type of Entries", "Delete") && (
                                  <i
                                    className="mdi mdi-delete"
                                    data-bs-toggle="tooltip"
                                    title="Delete"
                                    onClick={() => userRole.permissionLevel<=2 ?handleDelete(single._id) : handleDeleteFromSociety(single._id)}
                                  ></i>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No Data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>
                      Showing {paginatedEntries.length} of{" "}
                      {filteredEntries.length} entries
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
                You don't have access to view this page.
              </div>  
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EntriesList;


