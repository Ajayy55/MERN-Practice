import React, { useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography } from "@mui/material";
import Papa from "papaparse";
import { PORT } from "../../Api/api";
import "./entriesCsv.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Layout from "../../lib/Layout";
import { FaDownload } from "react-icons/fa";
import AddBackbtn from "../../lib/AddBackbtn";
import { ToastContainer, toast } from "react-toastify";
import { DataContext } from "../../lib/DataContext";
import { useContext } from "react";
const EntriesImportCsv = () => {
  const { addItem, removeItem, updateItem } = useContext(DataContext);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const createdBy = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const role_level = JSON.parse(localStorage.getItem("role")) || null;
  // console.log(society_id)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        complete: (result) => {
          if (
            result.data.length === 0 ||
            result.data.every((row) =>
              Object.values(row).every((cell) => cell === "")
            )
          ) {
            setError("CSV file is empty");
            setCsvData([]);
          } else {
            // Append parentId to each row
            const updatedData = result.data.map((row) => ({ ...row }));
            setCsvData(updatedData);
            setError("");
          }
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
          setError("Error parsing CSV file");
        },
      });
    } else {
      setError("No file selected");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || csvData?.length === 0) {
      setError("Please select CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("entriesCsvBySuperAdmin", file);
    formData.append("createdBy", createdBy);
    formData.append("society_id", society_id);
    formData.append("icon", "");
    formData.append("defaultPermissionLevel", role_level);
    try {
      const response = await axios.post(
        `${PORT}/entriesImportFormCsvBySuperAdmin`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        addItem(response.data.result);
        setMessage(response.data.msg);
      } else {
        setMessage("Failed to import entries");
      }
      const res = await response.data.msg;
      setMessage(res);
      setCsvData([]);
      setFile(null);
      document.querySelector('input[type="file"]').value = null; // Clear the file input field
      toast.success(res);
      // setMessage("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed");
    }
  };

  const handleDownload = () => {
    // Sample data for the CSV file
    const data = [
      {
        titleEnglish: "Worker",
        entryType: "Regular",
        joiningDate: "25-07-2024",
      },
      {
        titleEnglish: "Construction",
        entryType: "Occasional",
        joiningDate: "25-06-2024",
      },
    ];

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wpx: 150 }, 
      { wpx: 120 }, 
      { wpx: 100 }, 
    ];
    worksheet["!rows"] = [
      { hpx: 30 },
      { hpx: 25 }, 
    ];
    // Convert worksheet to CSV
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate}`;

    saveAs(blob, `${"Type of Entries Sample"}  ${dateTime}.csv`);
  };

  return (
    <div>
      <Layout>
        <AddBackbtn />
        <div className="container-fluid py-4 ">
          <div className="row">
            <div className="col-12  col-margin_top">
              <div className="card mb-4">
                <div className="card-header pb-0 mt--5">
                  <div className="heading_import">
                    <h4>Import Type of Entries </h4>
                    <button
                      className="buttom_download"
                      onClick={handleDownload}
                    >
                      <FaDownload />
                      Download Sample
                    </button>
                  </div>
                  <hr />
                  <div classNameName="error_msg_csv">
                    {error && (
                      <Typography id="modal-description" color="error">
                        <div
                          className="alerts
                    alerts-danger
                    "
                          role="alert"
                        >
                          {error}
                        </div>
                      </Typography>
                    )}

                    {/* {message && (
                      <Typography className="success_msg">
               toast.success()
                        </Typography>
                    )} */}
                  </div>

                  {/* <div className="upload-files-container"> */}
                  <div className="drag-file-area">
                    <span className="material-icons-outlined upload-icon">
                      {" "}
                      Type of Entries Import{" "}
                    </span>
                    <h3 className="dynamic-message">
                      {" "}
                      Drag &amp; drop any file here{" "}
                    </h3>
                    <label className="label">
                      <span className="browse-files">
                        <div className="input_csv_input">
                          <input type="file" onChange={handleFileChange} />
                        </div>
                        <span className="browse-files-text">browse file</span>{" "}
                        <span>from device</span>{" "}
                      </span>{" "}
                    </label>
                  </div>
                  <span className="cannot-upload-message">
                    {csvData.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <h3 className="preview_heading_csv">
                          CSV Data Preview
                        </h3>
                        <table className="tabel_csv_data_preview">
                          <thead>
                            <tr>
                              {Object.keys(csvData[0]).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvData.map((row, index) => (
                              <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                  <td key={i}>{value}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    )}
                  </span>
                  {/* <br/> */}
                  <form onSubmit={handleSubmit}>
                    <div className="upload_button_div">
                      <button type="submit" className="upload-button">
                        {" "}
                        Upload
                      </button>
                    </div>
                  </form>
                  {/* </div> */}
                  <div className="main-content mt-custom">
                    <div className="title">Sample Type of Entries - CSV</div>
                    <div className="cell-content">
                      <div>fx</div>
                      <div></div>
                    </div>
                    <div className="cells">
                      <div className="cells__spacer"></div>
                      <div className="cells__alphabet">A</div>
                      <div className="cells__alphabet">B</div>
                      <div className="cells__alphabet">C</div>

                      <div className="cells__number">1</div>
                      <div className="cells__number">2</div>
                      <div className="cells__number">3</div>
                      <div className="cells__number">4</div>
                      <div className="cells__number">5</div>
                      <div className="cells__number">6</div>
                      <div className="cells__number">7</div>
                      <div className="cells__number">8</div>
                      <div className="cells__number">9</div>
                      <div className="cells__number">10</div>
                      <div className="cells__number">11</div>
                      <div className="cells__number">12</div>
                      <div className="cells__number">13</div>
                      <div className="cells__number">14</div>
                      <div className="cells__number">15</div>
                      <div className="cells__input">Entry</div>
                      <div className="cells__input">Entry Type</div>
                      <div className="cells__input">Joining-Date</div>

                      {/* <div className="cells__input">
                        <abbr
                          className="DateTimeS"
                          data-title="<div className='container'><span>You have to create this id at our own.</span><br><p>take <span style='color:#f8c62a'>Field Users name</span> first.</p><p>if user name is same then add a unique id like employeid for uniquenity. now add a <span style='color:#f8c62a'>@</span> after that</p><p>You Company url code is <span style='color:#f8c62a'>khusal</span>. just add this after @ </p><p>at the end please add <span style='color:#f8c62a'>.swif</span></p></div>"
                        >
                          {" "}
                        </abbr>
                      </div> */}

                      <div className="cells__input">Worker</div>
                      <div className="cells__input">Regular</div>
                      <div className="cells__input">25-07-2024</div>

                      <div className="cells__input">Construction</div>
                      <div className="cells__input">Occasional</div>
                      <div className="cells__input">25-06-2024</div>

                      <div className="cells__input"></div>
                      <div className="cells__input"></div>
                      <div className="cells__input"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Layout>
    </div>
  );
};

export default EntriesImportCsv;
