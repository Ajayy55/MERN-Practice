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
const HouseListImportCsv = () => {
  const { addItem } = useContext(DataContext);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const createdBy = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
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
    formData.append("houseCsv", file);
    formData.append("createdBy", createdBy);
    formData.append("society_id", society_id);

    try {
      const response = await axios.post(
        `${PORT}/houseListImportFormCsv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      document.querySelector('input[type="file"]').value = null;
      toast.success(res);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response.data.msg);
      setMessage("File upload failed");
    }
  };

  const handleDownload = () => {
    const data = [
      {
        houseNo: "1",
        blockNumber: "21",
        ownerName: "Amit Kumar",
        userPhoneNo: "7876121490",
        aadhaarNumber: "983782468372",
        username: "houseowner@gmail.com",
        password: "house@123",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate}`;

    saveAs(blob, `${"House List Sample"}  ${dateTime}.csv`);
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
                    <h4>Import House List </h4>
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
                  </div>

                  <div className="drag-file-area">
                    <span className="material-icons-outlined upload-icon">
                      {" "}
                      House List Import{" "}
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
                        <div className="overflow_div_houselist">
                          <table className="tabel_csv_data_preview_houselist_view">
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
                        </div>
                      </Box>
                    )}
                  </span>
                  <form onSubmit={handleSubmit}>
                    <div className="upload_button_div">
                      <button type="submit" className="upload-button">
                        {" "}
                        Upload
                      </button>
                    </div>
                  </form>
                  <div className="main-content mt-custom">
                    <div className="title">Sample Type of House List - CSV</div>
                    <div className="cell-content">
                      <div>fx</div>
                      <div></div>
                    </div>
                    <div className="house_cells">
                      <div className="cells__spacer"></div>
                      <div className="cells__alphabet">A</div>
                      <div className="cells__alphabet">B</div>
                      <div className="cells__alphabet">C</div>
                      <div className="cells__alphabet">D</div>
                      <div className="cells__alphabet">E</div>
                      <div className="cells__alphabet">F</div>
                      <div className="cells__alphabet">G</div>
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
                      <div className="cells__input">houseNo</div>
                      <div className="cells__input">ownerName</div>
                      <div className="cells__input">userPhoneNo</div>
                      <div className="cells__input">blockNumber</div>
                      <div className="cells__input"> aadhaarNumber</div>
                      <div className="cells__input">username</div>
                      <div className="cells__input">password</div>
                      <div className="cells__input">2</div>
                      <div className="cells__input">sanjeev Kumar</div>
                      <div className="cells__input">7876122490</div>
                      <div className="cells__input">289</div>
                      <div className="cells__input">983780468372</div>
                      <div className="cells__input">societyhouse@gmail.com</div>
                      <div className="cells__input">society@123</div>
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

export default HouseListImportCsv;
