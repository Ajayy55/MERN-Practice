import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { PORT } from "../../port/Port";
import axios from "axios";
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
};

function UsersList() {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 10; // Items per page

  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Fetch user list
  const fetchUsersList = async () => {
    try {
      const admin = localStorage.getItem("user");
      const url = `${PORT}getUsersByCreatedBy/${admin}`;
      const response = await axios.get(url);
      // console.log(response);
      
      if (response.status === 200) {
        setUsersData(response.data.response);
        setFilteredData(response.data.response); // Initialize filtered data
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  // Handle search input
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = usersData.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.society?.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
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
          axios.delete(`${PORT}removeUser/${id}`).then((response) => {
            if (response.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "User removed successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchUsersList();
            }
          });
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    });
  };

  // Handle edit action
  const handleEdit = (user) => {
    // console.log(user);
    
    navigate(`/users/edituser`, { state: user });
  };

  return (
    // <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            {hasPermission("Users", "Read") ? (
              <div className="card-body">
                <div className="card-title d-flex justify-content-between">
                  {hasPermission("Users", "Create") && (
                    <Link to="addUser" className="btn" style={customButtonStyle}>
                      <i className="mdi mdi-plus-box" /> Add User
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
                        <th>User</th>
                        <th>Society Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEntries.length > 0 && paginatedEntries.map((user) => {
                       return <tr key={user._id}>
                          <td className="py-1 text-capitalize">
                            <img
                              src="../../assets/images/faces-clipart/pic-1.png"
                              alt="user avatar"
                              className="me-2"
                            />
                            {user.name}
                          </td>
                          <td>{user.society ? user?.society?.name :<span className="px-5" > -</span>}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.isActive ? (
                              <div className="badge badge-outline-success">Active</div>
                            ) : (
                              <div className="badge badge-outline-danger">Inactive</div>
                            )}
                          </td>
                          <td className="text-capitalize">{user.role?.title}</td>
                          <td>
                            <div>
                              {hasPermission("Users", "Edit") && (
                                <i
                                  className="mdi mdi-lead-pencil pe-3"
                                  data-bs-toggle="tooltip"
                                  title="Edit"
                                  onClick={() => handleEdit(user)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              {hasPermission("Users", "Delete") && (
                                <i
                                  className="mdi mdi-delete"
                                  data-bs-toggle="tooltip"
                                  title="Delete"
                                  onClick={() => handleDelete(user._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      })}
                      {paginatedEntries.length === 0 && usersData.length === 0 && (
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

export default UsersList;
