import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { PORT } from "../Api/api";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";

function AddMaidEntry() {
  const [maidName, setMaidName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

  const getMaid = async () => {
    try {
      const response = await axios.get(`${PORT}/getMaidEntry`);
      setMaidName(response.data.data);
      const totalItems = response.data.data.length;
      setTotalPages(Math.ceil(totalItems / perPage));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch maid data when the component mounts
    getMaid();
  }, [currentPage, perPage]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: "my-swal",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${PORT}/deleteHouseMaidEntry/${id}`);
        setMaidName(maidName.filter((item) => item._id !== id));
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error");
    }
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, maidName.length);
  const currentPageData = maidName.slice(startIndex, endIndex);

  return (
    <>
      <div>
        <div className="main-admin">
          <AdminNavbar />
          <div className="admin-content">
            <div className="data-table-container">
              <h2>List of House Maid</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="entry-type">Maid Names</th>
                    <th className="purpose-type">Clock-In</th>
                    <th className="purpose-type">Clock-Out</th>
                    <th className="purpose-type">Date</th>
                    <th className="purpose-type">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((item, index) => (
                    <tr key={index}>
                      <td className="entry-type">{item.maidName}</td>
                      <td className="entry-type">{item.submitedTime}</td>
                      <td className="entry-type">{item.clockoutTime}</td>
                      <td className="entry-type">{item.submitedDate}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="dlt-btn"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination pagination-admin">
                <button
                  className="pagi"
                  onClick={handlePrevPage}
                  style={{ opacity: currentPage === 1 ? "0.5" : "1" }}
                >
                  {" "}
                  Prev
                </button>
                <span className="pagi"> {currentPage}</span>
                <button
                  className="pagi"
                  onClick={handleNextPage}
                  style={{ opacity: currentPage === totalPages ? "0.5" : "1" }}
                >
                  Next{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddMaidEntry;
