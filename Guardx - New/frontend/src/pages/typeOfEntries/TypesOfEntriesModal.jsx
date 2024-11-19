import React, { useState, useEffect } from "react";
import { PORT } from "../../port/Port";
import './modalStyle.css'
import axios from "axios";
import Swal from "sweetalert2";


const TypesOfEntriesModal = ({ show, onClose, entries, id }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [selectedEntries, setSelectedEntries] = useState([]);

  useEffect(() => {
    // Filter entries based on the search term
    setFilteredEntries(
      entries.filter((entry) =>
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, entries]);

  const toggleSelection = (entryId) => {
    setSelectedEntries((prevSelected) =>
      prevSelected.includes(entryId)
        ? prevSelected.filter((id) => id !== entryId) // Deselect if already selected
        : [...prevSelected, entryId] // Select if not selected
    );
    
  };
  const handleSelectAll = () => {
    setSelectedEntries(filteredEntries.map((entry) => entry._id));
  };

  const handleDeselectAll = () => {
    setSelectedEntries([]);
  };

  const handleAllEntries = () => {
    setFilteredEntries(entries);
  };
  const handleRegularEntries = () => {
    const regularEntries = entries.filter((entry) => entry.entryType === "regular");
    setFilteredEntries(regularEntries);
  };

  const handleOccasionalEntries = () => {
    const occasionalEntries = entries.filter(
      (entry) => entry.entryType === "occasional"
    );
    setFilteredEntries(occasionalEntries);
  };

  const isSelected = (entryId) => selectedEntries.includes(entryId);
  // console.log(selectedEntries);
  const handleAddEntries=async()=>{
   
    try {
      // const id="6731880e33cc6e06c07b10eb";
      const url=`${PORT}addTypesOfEntriesToSociety/${id}`;
     
     
      const response=await axios.post(url,selectedEntries);
      if(response.status==200){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Entries Added Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(()=>{
          setSelectedEntries("")
          onClose()
        },1500)
      }
       
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="modal-dialog"
        style={{
          width: "400px",
          margin: "auto",
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <div
            className="modal-header"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px",
            }}
          >
            <h6 className="modal-title">Select Entry Type</h6>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              style={{ filter: "invert(1)" }}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{
              padding: "15px",
            }}
          >
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <div>
                {/* <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() =>
                    setSelectedEntries(
                      filteredEntries.every((entry) =>
                        selectedEntries.includes(entry._id)
                      )
                        ? []
                        : filteredEntries.map((entry) => entry._id)
                    )
                  }
                >
                  {filteredEntries.every((entry) =>
                    selectedEntries.includes(entry._id)
                  )
                    ? "Deselect All"
                    : "Select All"}
                </button> */}
                 <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{background:'#4CAF50'}}
                >
                  Actions
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button className="dropdown-item" onClick={handleSelectAll}>
                      Select All
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleDeselectAll}>
                      Deselect All
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleAllEntries}>
                      All Entries
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleRegularEntries}>
                      Regular Entries
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleOccasionalEntries}>
                      Occasional Entries
                    </button>
                  </li>
                </ul>
              </div>


                {/* <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {setSearchTerm(""); setFilteredEntries("");}}
                >
                  Clear
                </button> */}
              </div>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "200px" }}
              />
            </div>
            <div
              className="d-flex flex-wrap justify-content-start"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <div
                    key={entry._id}
                    className={`card m-2 ${
                      isSelected(entry._id) ? "card-selected" : ""
                    }`}
                    onClick={() => toggleSelection(entry._id)}
                    style={{
                      width: "100px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={
                        entry.icon
                          ? `${PORT}${entry.icon.split("public")[1]}`
                          : "../../assets/images/faces-clipart/pic-1.png"
                      }
                      alt={entry.title}
                      className="card-img-top"
                      style={{
                        borderRadius: "50%",
                        width: "60%",
                        height: "60px",
                        margin: "10px auto",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <div className="card-body p-1">
                      <p
                        className="card-text"
                        style={{
                          fontSize: "12px",
                          margin: "0",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {entry.title}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center w-100 text-muted">
                  No entries found.
                </p>
              )}
            </div>
          </div>
          <div
            className="modal-footer"
            style={{
              justifyContent: "center",
              backgroundColor: "#f1f1f1",
            }}
          >
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleAddEntries}
              style={{
                padding: "5px 15px",
                border: "1px solid #ddd",
                background:'#4CAF50'
              }}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypesOfEntriesModal;
