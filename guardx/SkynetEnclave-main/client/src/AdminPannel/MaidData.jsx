import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { PORT } from "../Api/api";
import AddMaid from "./AddMaid";
import Swal from "sweetalert2";
import EditHouseMaid from "./EditHouseMaid";
import { MdDelete } from "react-icons/md";
import "./maid.css";
function MaidData() {
  const [maidName, setMaidName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;
  const getMaid = async () => {
    try {
      const response = await axios.get(`${PORT}/getVerifieUser`);
      setMaidName(response.data.verifyHouseMaid);
      const totalItems = response.data.verifyHouseMaid.length;
      setTotalPages(Math.ceil(totalItems / perPage));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
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
        await axios.delete(`${PORT}/delHouseMaid/${id}`);

        setMaidName(maidName.filter((item) => item._id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleMaidId = (id) => {
    localStorage.setItem("maidId", id);
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
            <div className="data-table-container table-maid">
              <div className="add">
                <div className="head">
                  <h2 className="list_house_maid">List of House Maid</h2>
                </div>
                <div className="add-button">
                  <AddMaid />
                </div>
              </div>

              <table className="data-table ">
                <thead>
                  <tr>
                    <th className="entry-type">Maid Names</th>
                    <th>Gender</th>
                    <th>Adhar No.</th>
                    <th>Others</th>

                    <th className="adhar-image">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((item, index) => (
                    <tr key={index}>
                      <td className="entry-type">{item.houseMaidEnglish} </td>
                      <td>{item.gender}</td>
                      <td>{item.aadharNumber}</td>
                      <td>
                        <img src={item.image} alt="" />
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleMaidId(item._id)}
                          className="edit-btn"
                        >
                          <EditHouseMaid />
                        </button>
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

export default MaidData;
