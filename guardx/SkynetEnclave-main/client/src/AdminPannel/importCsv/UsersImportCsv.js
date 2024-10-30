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
import ExcelJS from "exceljs";
const UsersImportCsv = () => {
  const { addItem, removeItem, updateItem } = useContext(DataContext);
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const createdBy = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const getRoleLevel = localStorage.getItem("roleLevel");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop();

    if (fileExtension === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        complete: handleCsvParseComplete,
        error: (error) => setError("Error parsing CSV file"),
      });
    } else if (fileExtension === "xlsx") {
      handleXlsxFile(selectedFile);
    } else {
      setError("Unsupported file format. Please upload a CSV or XLSX file.");
    }
  };

  const handleCsvParseComplete = (result) => {
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
  };

  const handleXlsxFile = (file) => {
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const result = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Define the required fields
      const requiredFields = ["username", "password", "role", "userPhoneNo"]; // Add more fields if needed
  
      if (
        result.length === 0 ||
        result.every((row) =>
          row.every((cell) => cell === "" || cell === undefined)
        )
      ) {
        setError("XLSX file is empty");
        setCsvData([]);
      } else {
        const headers = result[0];
        const updatedData = result.slice(1).map((row, rowIndex) => {
          const rowObject = {};
          headers.forEach((header, index) => {
            rowObject[header] = row[index];
          });
  
          // Check if the row has any non-empty fields before checking for missing required fields
          const hasData = Object.values(rowObject).some(
            (value) => value && value.trim() !== ""
          );
  
          if (hasData) {
            // Check for missing fields in the row
            const missingFields = requiredFields.filter(
              (field) => !rowObject[field] || rowObject[field].trim() === ""
            );
  
            // If any required field is missing, return an error
            if (missingFields.length > 0) {
              setError(
                `Missing fields in row ${rowIndex + 2}: ${missingFields.join(", ")}`
              );
              setCsvData([]);
              return null; // Stop further processing
            }
  
            // Validate username (email format)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(rowObject.username)) {
              setError(`Invalid email format in row ${rowIndex + 2}: ${rowObject.username}`);
              setCsvData([]);
              return null; // Stop further processing
            }
  
            // Validate password length
            if (rowObject.password.length < 6) {
              setError(`Password must be at least 6 characters long in row ${rowIndex + 2}`);
              setCsvData([]);
              return null; // Stop further processing
            }
  
            // Validate userPhoneNo (exactly 10 digits)
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(rowObject.userPhoneNo)) {
              setError(`User phone number must be exactly 10 digits in row ${rowIndex + 2}`);
              setCsvData([]);
              return null; // Stop further processing
            }
          }
  
          return rowObject;
        });
  
        // Only update if there was no error
        if (!updatedData.includes(null)) {
          setCsvData(updatedData);
          setError("");
        }
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || csvData.length === 0) {
      setError("Please select CSV file");
      return;
    }
    const cleanedData = csvData
      .map((row) => {
        return Object.fromEntries(
          Object.entries(row).filter(
            ([key, value]) => typeof value === "string" && value.trim() !== ""
          )
        );
      })
      .filter((row) => Object.keys(row).length > 0);

    // Prepare data for upload
    const formData = new FormData();
    formData.append("usersCsv", file);
    formData.append("createdBy", createdBy);
    formData.append("defaultPermissionLevel", getRoleLevel);
    formData.append("society_id", society_id);
    formData.append("csvData", JSON.stringify(cleanedData));

    try {
      const response = await axios.post(`${PORT}usersImportFormCsv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        addItem(response.data.result);
        setMessage(response.data.msg);
      } else {
        setMessage("Failed to import entries");
      }
      setCsvData([]);
      setFile(null);
      document.querySelector('input[type="file"]').value = null;
      toast.success(response.data.msg);
    } catch (error) {
      if (error.response && error.response.data) {
        const { msg, existingUsers } = error.response.data;

        if (existingUsers) {
          const existingUserMessages = Object.entries(existingUsers)
            .map(([username, count]) => `${username}: ${count} time(s)`)
            .join(", ");

          toast.error(`${msg}: ${existingUserMessages}`);
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }

      console.error("Error uploading file:", error.response.data);
    }
  };

  const getRoleId = JSON.parse(localStorage.getItem("roleId"));

  const getRole = localStorage.getItem("role");
  const handleDownload = async () => {
    let response = await axios.get(`${PORT}/roleGet`);
    const apiRoles = await response.data.roles;
    const filterDataRole = apiRoles.filter(
      (item) =>
        item.createdBy === getRoleId && item.defaultPermissionLevel !== 1
    );

    const rolesWithLessDefaultLevel = apiRoles.filter(
      (item) =>
        item.defaultPermissionLevel > getRole ||
        item.roleTypeLevelSociety === "guardAccess"
    );

    const extractedData = rolesWithLessDefaultLevel.map((role) => ({
      id: role._id,
      title: role.title,
      defaultPermissionLevel: role.defaultPermissionLevel,
    }));

    const filteredRolesData = filterDataRole.map((role) => ({
      id: role._id,
      title: role.title,
      defaultPermissionLevel: role.defaultPermissionLevel,
    }));
    const roleIdSet = new Set();
    const combinedData = [...extractedData, ...filteredRolesData].filter(
      (role) => {
        if (roleIdSet.has(role.id)) {
          return false;
        } else {
          roleIdSet.add(role.id);
          return true;
        }
      }
    );

    const rolesList = combinedData.map((role) => role.title);

    console.log("Roles List:", rolesList);

    if (rolesList.length === 0) {
      console.error("No roles available for the dropdown.");
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");
    worksheet.columns = [
      { header: "username", key: "username", width: 30 },
      { header: "userPhoneNo", key: "userPhoneNo", width: 20 },
      { header: "password", key: "password", width: 15 },
      { header: "role", key: "role", width: 20 },
    ];
    const data = [
      {
        username: "amitkumar@gmail.com",
        userPhoneNo: "7876121490",
        password: "G@123",
        role: "GuardLevel",
      },
      {
        username: "rahulkumar@gmail.com",
        userPhoneNo: "6230434766",
        password: "J#4!123",
        role: "SocietySubAdmin",
      },
    ];
    data.forEach((user, index) => {
      const rowIndex = index + 2;
      const row = worksheet.addRow(user);
      // Email validation
      worksheet.getCell(`A${rowIndex}`).dataValidation = {
        type: "custom",
        allowBlank: false,
        formula1: 'ISNUMBER(MATCH("*@*.?*", A2, 0))',
        showErrorMessage: true,
        errorTitle: "Invalid Email",
        error: "Please enter a valid email address.",
      };
      worksheet.getCell(`A${rowIndex}`).style = { locked: false };

      // Phone number validation
      worksheet.getCell(`B${rowIndex}`).dataValidation = {
        type: "custom",
        allowBlank: false,
        formula1: "AND(ISNUMBER(B2), LEN(B2) = 10)",
        showErrorMessage: true,
        errorTitle: "Invalid Phone Number",
        error: "Please enter a valid 10-digit phone number.",
      };
      worksheet.getCell(`B${rowIndex}`).style = { locked: false }
      worksheet.getCell(`D${rowIndex}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`=$Z$2:$Z$${rolesList.length + 1}`],
        showDropDown: true,
        errorStyle: "warning",
        errorTitle: "Invalid Selection",
        error: "Please select a role from the dropdown.",
      };
      worksheet.getCell(`D${rowIndex}`).style = { locked: false }
   
    });
    
    const rolesRangeStart = 2;
    rolesList.forEach((role, index) => {
      worksheet.getCell(`Z${rolesRangeStart + index}`).value = role;
    });
    const totalDataRows = data.length + 1;
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > totalDataRows) {
        row.hidden = true;
      }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate}`;

    saveAs(blob, `${"Users Sample"}  ${dateTime}.xlsx`);
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
                    <h4> Import Users</h4>
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
                      Import Users{" "}
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
                    {/* {csvData.length > 0 && (
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
                            {csvData
                              .filter((row) =>
                                Object.values(row).some(
                                  (value) => value && value.trim() !== ""
                                )
                              )
                              .map((row, index) => (
                                <tr key={index}>
                                  {Object.values(row).map((value, i) => (
                                    <td key={i}>
                                      {value && value.trim() !== ""
                                        ? value
                                        : null}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </Box>
                    )} */}
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
                            {csvData
                              .filter((row) =>
                                Object.values(row).some(
                                  (value) =>
                                    typeof value === "string" &&
                                    value.trim() !== ""
                                )
                              )
                              .map((row, index) => (
                                <tr key={index}>
                                  {Object.values(row).map((value, i) => (
                                    <td key={i}>
                                      {typeof value === "string" &&
                                      value.trim() !== ""
                                        ? value
                                        : String(value).trim() !== ""
                                        ? String(value)
                                        : null}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </Box>
                    )}
                  </span>
                  <form onSubmit={handleSubmit}>
                    <div className="upload_button_div">
                      <button
                        type="submit"
                        className="upload-button"
                        disabled={!file}
                      >
                        {" "}
                        Upload
                      </button>
                    </div>
                  </form>
                  <div className="main-content mt-custom">
                    <div className="title">Sample Users - CSV</div>
                    <div className="cell-content">
                      <div>fx</div>
                      <div></div>
                    </div>
                    <div className="user_cells">
                      <div className="cells__spacer"></div>
                      <div className="cells__alphabet">A</div>
                      <div className="cells__alphabet">B</div>
                      <div className="cells__alphabet">C</div>
                      <div className="cells__alphabet">D</div>

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
                      <div className="cells__input">username</div>
                      <div className="cells__input">userPhoneNo</div>
                      <div className="cells__input">password</div>
                      <div className="cells__input">role</div>

                      <div className="cells__input">amitKumar@gmail.com</div>
                      <div className="cells__input">9812183764</div>
                      <div className="cells__input">As&!123</div>
                      <div className="cells__input">GuardLevel</div>
                      <div className="cells__input">rahulKumar@gmail.com</div>
                      <div className="cells__input">8263068050</div>
                      <div className="cells__input">UsDe#$123</div>
                      <div className="cells__input">SocietySubAdmin</div>
                      <div className="cells__input"></div>
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

export default UsersImportCsv;
