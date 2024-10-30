import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { PORT } from "../../../Api/api";
import "./style.css";
import { LanguageContext } from "../../../lib/LanguageContext";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const ListSocietyUser = ({ data, onUserDelete }) => {
  const societyData = data;
  const { language } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageBySociety, setCurrentPageBySociety] = useState(1);
  const usersPerPage = 8;
  // const filteredData = useMemo(() => {
  //   return societyData.filter((user) => {
  //     const nameMatch = user?.name
  //       .toLowerCase()
  //       .includes(searchTerm?.toLowerCase());
  //     const phoneMatch = user?.userPhoneNo.toString().includes(searchTerm);
  //     const emailMatch = user?.username
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());
  //     const roleMatch = user?.role
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());
  //     return nameMatch || phoneMatch || emailMatch || roleMatch;
  //   });
  // }, [searchTerm, societyData, currentPageBySociety]);

  const filteredData = useMemo(() => {
    return societyData.filter((user) => {
      const nameMatch = user?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) || false;
      const phoneMatch = user?.userPhoneNo?.toString().includes(searchTerm) || false;
      const emailMatch = user?.username?.toLowerCase().includes(searchTerm?.toLowerCase()) || false;
      const roleMatch = user?.role?.toLowerCase().includes(searchTerm?.toLowerCase()) || false;
  
      return nameMatch || phoneMatch || emailMatch || roleMatch;
    });
  }, [searchTerm, societyData, currentPageBySociety]);
  
  useEffect(() => {
    setCurrentPageBySociety(1);
  }, [searchTerm]);
  // Pagination logic
  const indexOfLastUser = currentPageBySociety * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesBySociety = Math.ceil(filteredData.length / usersPerPage);
  const handleChangePageBySociety = (event, value) => {
    setCurrentPageBySociety(value);
  };
  //handleDelete
  const handleDelete = async (id) => {
    try {
      confirmAlert({
        // title: 'Confirm to delete',
        message: "Are you sure you want to delete this user?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              await axios.delete(`${PORT}/deleteUserWithSocietyUser/${id}`);
              toast.success("User has been deleted");
              onUserDelete(id);
            },
          },
          {
            label: "No",
            onClick: () => {
              toast.info("Deletion canceled");
            },
          },
        ],
        overlayClassName: "custom-confirm-dialog",
      });
    } catch (error) {
      console.error("Error deleting the user:", error);
      toast.error("Failed to delete the user.");
    }
  };

  return (
    <div>
      <br />
      <div className="list-view-society-user-heading">
        {language === "english"
          ? "आरडब्ल्यूए उपयोगकर्ता सूची"
          : "RWA (Resident Welfare Association) User list"}

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rwa-user-list-search-bar"
        />
      </div>

      <div className="list-view-society-user">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.userPhoneNo}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="dlt-btn">
                      <MdDelete
                        onClick={() => handleDelete(user._id)}
                        data-placement="top"
                        title={
                          language === "hindi" ? "Click to Delete" : "हटाएं"
                        }
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="no_data_entry">No data</div>
                </td>
              </tr>
            )}
            <td className="rwa-user-list-pagination-main-div" colSpan={6}>
              {totalPagesBySociety > 1 && (
                <div className="table-pagination">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPagesBySociety}
                      page={currentPageBySociety}
                      onChange={handleChangePageBySociety}
                      color="primary"
                    />
                  </Stack>
                </div>
              )}
            </td>
          </tbody>
        </table>
        {/* <ToastContainer /> */}
      </div>
    </div>
  );
};

export default ListSocietyUser;
