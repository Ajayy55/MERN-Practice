import React, { useContext, useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { PORT } from "../Api/api";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Backbutton from "../GoBack/Backbutton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Papa from "papaparse";
import "./request.css";
import "./form.css";
import { ThreeCircles } from "react-loader-spinner";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GoArrowDownLeft } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
function Attendance() {
  const { language } = useContext(LanguageContext);
  const [getAttendance, setGetAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const perPage = 10;
  const params = useParams();
  const id = params.id;
  const getVerifiedData = async () => {
    try {
      const result = await axios.get(`${PORT}/getMaidEntry`);
      setGetAttendance(result.data.data.reverse());
      setLoadingPermission(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVerifiedData();
  }, []);
  useEffect(() => {
    let filteredData = getAttendance.filter((item) => item.parentId === id);
    if (startDate) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.submittedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate >= new Date(startDate);
      });
    }
  
    if (endDate) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.submittedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate <= new Date(endDate);
      });
    }
    const totalPages = Math.ceil(filteredData.length / perPage);
    setTotalPages(totalPages);
    setFilteredData(filteredData);
  }, [getAttendance, id, startDate, endDate]);
  const handleDelete = async (item) => {
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
      await axios.delete(`${PORT}/deleteHouseMaidEntry/${item}`);
      setGetAttendance(getAttendance.filter((entry) => entry._id !== item));
    }
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  // Function to export data to Excel
  const exportToExcel = (data, filename) => {
    const formattedData =
      data.length > 0
        ? data.map(
            ({ maidName, submittedDate, clockInTime, clockOutTime }) => ({
              Name: maidName,
              "Submitted Date": submittedDate,
              "Clock-In Time": clockInTime,
              "Clock-Out Time": clockOutTime?clockOutTime:"In Soceity",
            })
          )
        : [
            {
              Name: "No data",
              "Submitted Date": "No data",
              "Clock-In Time": "No data",
              "Clock-Out Time": "No data",
            },
          ];

    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    const wscols = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentTimeAndDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    FileSaver.saveAs(blob, `${filename} ${currentTimeAndDate}.xlsx`);
  };

  const exportToCSV = (data, filename) => {
    const filteredData =
      data.length > 0
        ? data.map(
            ({ maidName, submittedDate, clockInTime, clockOutTime }) => ({
              Name: maidName,
              "Submitted Date": submittedDate,
              "Clock-In Time": clockInTime,
              "Clock-Out Time": clockOutTime?clockOutTime:"In Soceity",
            })
          )
        : [
            {
              Name: "No data",
              "Submitted Date": "No data",
              "Clock-In Time": "No data",
              "Clock-Out Time": "No data",
            },
          ];

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    FileSaver.saveAs(blob, `${filename} ${currentTimeAndDate}.csv`);
  };

  return (
    <>
      <Layout>
        <AddBackbtn />
        <div class="container-fluid py-4 ">
          <div class="row">
            <div class="col-12  col-margin_top">
              <div class="card mb-4">
                <div class="card-header pb-0">
                  <div className="filtered-attendance-div">
                    <div className="p-export-btn export-dropdown">
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <TiExport className="export_icon" />
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="export-btns">
                            <button
                              className="export_btn_maidattandance"
                              onClick={() =>
                                exportToExcel(filteredData, "Attendance")
                              }
                            >
                              Excel
                            </button>

                            <button
                              className="export_btn_data"
                              onClick={() =>
                                exportToCSV(filteredData, "Attendance")
                              }
                            >
                              CSV
                            </button>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                    <div className="search-filter-box">
                      <Box
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#5e72e4", // Default border color
                              borderWidth: "1px", // Default border width
                              borderRadius: "5px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#5e72e4", // Border color on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#5e72e4", // Border color on focus
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#5e72e4", // Label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#5e72e4", // Text color inside input
                          },
                          "& .MuiInputLabel-root.Mui-error": {
                            color: "#5e72e4", // Label color when error
                          },
                        }}
                      >
                        <div className="date-filter-attendance">
                          <div className="date-filterd-attendance">
                            <TextField
                              id="start-date"
                              label={
                                language === "hindi"
                                  ? "Start Date"
                                  : "आरंभ करने की तिथि"
                              }
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              InputLabelProps={{
                                shrink: true,
                                style: { color: "#5e72e4" }, // Label color
                              }}
                              InputProps={{
                                style: { color: "#5e72e4" }, // Text color inside input
                              }}
                              variant="outlined"
                            />
                            <TextField
                              id="end-date"
                              label={
                                language === "hindi" ? "End Date" : "अंतिम तिथि"
                              }
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              InputLabelProps={{
                                shrink: true,
                                style: { color: "#5e72e4" }, // Label color
                              }}
                              InputProps={{
                                style: { color: "#5e72e4" }, // Text color inside input
                              }}
                              variant="outlined"
                            />
                          </div>
                        </div>
                      </Box>
                    </div>
                  </div>
                  <div class="card-body px-0 pt-0 pb-2 w-100">
                    <div class="table-responsive p-0">
                      {loadingPermission ? (
                        <div className="three_circle_loader">
                          <ThreeCircles
                            visible={true}
                            height={100}
                            width={100}
                            color="#5e72e4"
                            ariaLabel="three-circles-loading"
                          />
                        </div>
                      ) : (
                        <table className="table align-items-center mb-0">
                          <thead>
                            <tr>
                              <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "Name " : "नाम"}
                              </th>
                              <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "Clock-In "
                                  : "घड़ी में"}
                              </th>
                              <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "   Clock-Out "
                                  : "काम समाप्त करना"}
                              </th>
                              <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "    Date " : "तारीख"}
                              </th>
                              <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "   Delete " : "मिटाना"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.length > 0 ? (
                              currentPageData.map(
                                (item, index) =>
                                  item.parentId === id && (
                                    <tr key={index}>
                                      <td className="align-middle text-center">
                                        {item.maidName}
                                      </td>
                                      <td className="align-middle text-center">
                                        <GoArrowDownLeft className="down_icon" />{" "}
                                        {item.clockInTime}
                                      </td>
                                      <td className="align-middle text-center">
                                        <GoArrowUpRight className="up_icon" />{" "}
                                        {item.clockOutTime
                                          ? item.clockOutTime
                                          : "In Society"}
                                      </td>
                                      <td className="align-middle text-center">
                                        {item.submittedDate}
                                      </td>
                                      <td
                                        onClick={() => handleDelete(item._id)}
                                        className=" dlt_btn_attendance align-middle text-center"
                                      >
                                        <MdDelete />
                                      </td>
                                    </tr>
                                  )
                              )
                            ) : (
                              <tr>
                                <td colSpan={5}>
                                  <div className="no_data_entry"> No data</div>
                                </td>
                              </tr>
                            )}

                            <td colSpan={5}>
                              {totalPages > 1 && (
                                <div className="table-pagination">
                                  <Stack spacing={2}>
                                    <Pagination
                                      count={totalPages}
                                      page={currentPage}
                                      onChange={handleChangePage}
                                    />
                                  </Stack>
                                </div>
                              )}
                            </td>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Attendance;
