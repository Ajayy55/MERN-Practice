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
const SocietyImportCsv = () => {
  const { addItem, removeItem, updateItem } = useContext(DataContext);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const createdBy = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  // console.log(society_id)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (
          jsonData.length === 0 ||
          jsonData.every((row) => row.every((cell) => cell === ""))
        ) {
          setError("Excel file is empty");
          setCsvData([]);
        } else {
          const headers = jsonData[0];
          const dataRows = jsonData.slice(1);
          const parsedData = dataRows.map((row) =>
            headers.reduce((obj, header, i) => {
              obj[header] = row[i] || "";
              return obj;
            }, {})
          );

          // Append contactName if necessary
          const updatedData = parsedData.map((row) => ({
            ...row,
          }));

          setCsvData(updatedData);
          setError("");
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading Excel file:", error);
        setError("Error reading Excel file");
      };

      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError("No file selected");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || csvData?.length === 0) {
      setError("Please select EXCEL file");
      return;
    }
    const formData = new FormData();
    formData.append("societyCsv", file);
    formData.append("createdBy", createdBy);
    try {
      const response = await axios.post(
        `${PORT}/societyListImportFormCsv`,
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
        console.log(response.data.result);
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
    } catch (error) {
      toast.error(error.response.data.msg);
      console.error("Error uploading file:", error);
      setMessage("File upload failed");
    }
  };

  const handleDownload = () => {
    const data = [
      {
        name: "Green Valley Apartments",
        address: "Moli Pind 80 Sector",
        state: "Punjab",
        city: "mohali",
        societyContactNumber: "8262089040",
        societyHouseList: "234",
        societyRegistration: "CH/5678/2023",
      },
    ];

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];

    // Set row heights (if needed)
    worksheet["!rows"] = [{ hpt: 20 }, { hpt: 20 }, { hpt: 20 }];

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SocietyList");

    // Export the workbook to Excel format
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob from the Excel buffer
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate}`;

    saveAs(blob, `${"SocietyList Sample"}  ${dateTime}.xlsx`);
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
                    <h4>Import Societies </h4>
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
                      Societies Import{" "}
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
                    <div className="overflow_div_houselist">
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
                    </div>
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
                    <div className="title">Sample Societies - CSV</div>
                    <div className="cell-content">
                      <div>fx</div>
                      <div></div>
                    </div>
                    <div className="society_cells">
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
                      <div className="cells__input">name</div>
                      <div className="cells__input"> address</div>
                      <div className="cells__input">state</div>
                      <div className="cells__input">city</div>
                      <div className="cells__input">societyContactNumber</div>
                      <div className="cells__input"> societyHouseList</div>
                      <div className="cells__input"> societyRegistration</div>
                      <div className="cells__input">
                        Shanti Residency Society
                      </div>
                      <div className="cells__input">Blongi</div>

                      <div className="cells__input">Punjab</div>
                      <div className="cells__input">mohali</div>

                      <div className="cells__input">7876121480</div>
                      <div className="cells__input">567</div>
                      <div className="cells__input">SRS478324</div>
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

export default SocietyImportCsv;
