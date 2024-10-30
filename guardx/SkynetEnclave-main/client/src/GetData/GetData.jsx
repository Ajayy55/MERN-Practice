import React, { useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../Api/api";
import "./style.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import PreviewImage from "./PreviewImage";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThreeCircles } from "react-loader-spinner";
import Papa from "papaparse";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./style.css";
import Layout from "../lib/Layout";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import { GoArrowDownLeft } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import { formatDate } from "../lib/FormattedDate";
function GetData() {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const perPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const [loadingPermission, setLoadingPermission] = useState(true);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${PORT}/getData`);
      const res = await response.data.data;
      const filterDataAccSociety = await res.filter(
        (item) => item.society_id === society_id
      );

      setData(filterDataAccSociety.reverse());
      setTimeout(() => {
        setLoadingPermission(false);
      }, 800);

      setTotalPages(Math.ceil(filterDataAccSociety.length / perPage));

      if (filterDataAccSociety) {
        setLoading(false);
      }
      setTotalPages(Math.ceil(filterDataAccSociety.length / perPage));
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${PORT}/delUser/${id}`);
      setData(data.filter((item) => item._id !== id));
      fetchData();
      await Swal.fire("Deleted!", "Your file has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handlePreviewImage = (id) => {
    localStorage.setItem("previewImageId", JSON.stringify(id));
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const exportToExcel = (data, filename) => {
    const filteredData = data.map(
      ({
        entryType,
        purposeType,
        houseDetails,
        submitedDate,
        submitedTime,
      }) => ({
        "Entry Type": entryType,
        "Purpose Type": purposeType,
        "House No": JSON.parse(houseDetails).houseNo,
        Owner: JSON.parse(houseDetails).owner,
        "Submitted Date": submitedDate,
        "Submitted Time": submitedTime,
      })
    );

    const ws = XLSX.utils.json_to_sheet(filteredData);

    const wscols = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate} `;
    FileSaver.saveAs(blob, `${filename} ${dateTime}.xlsx`);
  };

  const exportToCSV = (data, filename) => {
    const filteredData = data.map(
      ({
        entryType,
        purposeType,
        houseDetails,
        submitedDate,
        submitedTime,
      }) => ({
        "Entry Type": entryType,
        "Purpose Type": purposeType,
        "House No": JSON.parse(houseDetails).houseNo,
        Owner: JSON.parse(houseDetails).owner,
        "Submitted Date": submitedDate,
        "Submitted Time": submitedTime,
      })
    );

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate} `;
    FileSaver.saveAs(blob, `${filename} ${dateTime}.csv`);
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedData = results.data.map((item) => ({
          entryType: item["Entry Type"],
          purposeType: item["Purpose Type"],
          houseDetails: JSON.stringify({
            houseNo: item["House No"],
            owner: item["Owner"],
          }),
          submitedDate: item["Submitted Date"],
          submitedTime: item["Submitted Time"],
        }));

        setData((prevData) => [...prevData, ...importedData]);
      },
      error: (error) => {
        console.error("Error importing CSV:", error);
      },
    });
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, data.length);
  const currentPageData =
    filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : data.slice(startIndex, endIndex);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredData = data.filter((item) => {
      const houseDetails = JSON.parse(item.houseDetails || "{}");

      return (
        item.entryType
          ?.toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        item.purposeType
          ?.toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        houseDetails.houseNo
          ?.toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        houseDetails.owner
          ?.toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        item.submitedDate
          ?.toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim()) ||
        item.submitedTime
          ?.toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim())
      );
    });
    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredData(data);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      fetchData();
      setTotalPages(Math.ceil(data.length / perPage));
    }
  }, [searchQuery]);

  //handle Date Range Functionality
  useEffect(() => {
    let filteredData = data;

    if (startDate) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.submitedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        // Check if the date is greater than or equal to startDate
        return formattedDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.submitedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        // Check if the date is less than or equal to endDate
        return formattedDate <= new Date(endDate);
      });
    }

    if (searchQuery) {
      filteredData = filteredData.filter((item) => {
        const houseDetails = JSON.parse(item.houseDetails || "{}");

        return (
          item.entryType
            ?.toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          item.purposeType
            ?.toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          houseDetails.houseNo
            ?.toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          houseDetails.owner
            ?.toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          item.submitedDate
            ?.toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim()) ||
          item.submitedTime
            ?.toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim())
        );
      });
    }

    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
  }, [data, searchQuery, startDate, endDate]);
  return (
    <div>
      <Layout>
        <div className="container-fluid  ">
          <div className="row">
            <div className="col-12  ">
              <div className="card mb-4">
                <div className="card-header pb-0">
                  <div className="filtered-div">
                    <div className="p-export-btn export-dropdown">
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ArrowDropDownIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography>
                            {" "}
                            <TiExport className="export_icon" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div className="export-btns">
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToExcel(
                                    filteredData,
                                    "Guest Entries Requests"
                                  )
                                }
                              >
                                Excel
                              </button>
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToCSV(
                                    filteredData,
                                    "Guest Entries Requests"
                                  )
                                }
                              >
                                CSV
                              </button>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>

                    <Box
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: " #5e72e4", // Default border color
                            borderWidth: "1px", // Default border width
                            borderRadius: "5px",
                          },
                          "&:hover fieldset": {
                            borderColor: " #5e72e4", // Border color on hover
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: " #5e72e4", // Border color on focus
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: " #5e72e4", // Label color
                        },
                        "& .MuiInputBase-input": {
                          color: " #5e72e4", // Text color inside input
                        },
                        "& .MuiInputLabel-root.Mui-error": {
                          color: " #5e72e4", // Label color when error
                        },
                      }}
                    >
                      <div className="date-filter">
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
                            style: { color: " #5e72e4" }, // Label color
                          }}
                          InputProps={{
                            style: { color: " #5e72e4" }, // Text color inside input
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
                            style: { color: " #5e72e4" }, // Label color
                          }}
                          InputProps={{
                            style: { color: " #5e72e4" }, // Text color inside input
                          }}
                          variant="outlined"
                        />
                      </div>
                    </Box>
                    <div className="search-filter-box">
                      <Box
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: " #5e72e4",
                              borderWidth: "1px",
                              borderRadius: "5px",
                            },
                            "&:hover fieldset": {
                              borderColor: "  #5e72e4",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "  #5e72e4",
                            },

                            "& .MuiInputLabel-root.Mui-error": {
                              color: " #5e72e4",
                            },
                          },
                        }}
                      >
                        <div className="text-field">
                          <TextField
                            id="search-input"
                            label={
                              language === "hindi" ? "Search ...." : "खोज ...."
                            }
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            className="search-input"
                          />
                        </div>
                      </Box>
                    </div>
                  </div>
                </div>
                <div className="card-body px-0 pt-0 pb-2 w-100">
                  <div className="table-responsive p-0   overflow-auto">
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
                    ) : permissions[1]?.actions.read ? (
                      <table class="table align-items-center mb-0  overflow-auto">
                        <thead>
                          <tr>
                            <th class="text-center  text-dark text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? "Entry Type"
                                : "प्रवेश प्रकार"}
                            </th>
                            <th class="text-center  text-dark  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? "Purpose Type"
                                : "पउद्देश्य प्रकार"}
                            </th>
                            <th class="text-center text-dark  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? " House Details"
                                : "घर का विवरण"}
                            </th>

                            <th class="text-center  text-dark  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Date" : "तारीख"}
                            </th>
                            <th class="text-center  text-dark  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Clock-In" : "कार्य आरंभ"}
                            </th>
                            <th class="text-center  text-dark  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? "Clock-Out"
                                : "कार्य समाप्ति"}
                            </th>
                            <th class="text-center  text-dark  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Actions" : "कार्रवाई"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredData.length > 0 ? (
                            currentPageData.map((item, index) => (
                              <tr key={index}>
                                <td className="entry-type align-middle text-center text-sm   ">
                                  {item.entryType.length > 20
                                    ? item.entryType.substring(0, 15) + "..."
                                    : item.entryType}
                                </td>
                                <td className="purpose-type align-middle text-center text-sm">
                                  {item.purposeType === "null" ||
                                  item.purposeType === "undefined" ? (
                                    <b className="">Not Added</b>
                                  ) : (
                                    item.purposeType
                                  )}
                                </td>
                                <td className="house-details align-middle text-center text-sm">
                                  <b>
                                    {language === "hindi"
                                      ? "House No:"
                                      : "मकान नं:"}
                                  </b>{" "}
                                  {JSON.parse(item.houseDetails).houseNo}
                                  <br />
                                  <b>
                                    {language === "hindi" ? "Owner:" : "मालिक:"}
                                  </b>{" "}
                                  {JSON.parse(item.houseDetails).owner
                                    ? JSON.parse(item.houseDetails).owner
                                    : JSON.parse(item.houseDetails).ownerName}
                                </td>
                                <td className="purpose-type align-middle text-center text-sm">
                                  {formatDate(item.submitedDate)}
                                </td>
                                <td className="purpose-type align-middle text-center text-sm">
                                  <GoArrowDownLeft className="down_icon" />{" "}
                                  {item.submitedTime}
                                </td>
                                <td className="purpose-type align-middle text-center text-sm">
                                  <GoArrowUpRight className="up_icon" />{" "}
                                  {item.clockOut === "null" || !item.clockOut
                                    ? "In Society"
                                    : item.clockOut}
                                </td>

                                <td className="align-middle text-center  d-flex justify-content-center ">
                                  <PreviewImage
                                    item={item}
                                    onClick={() => handlePreviewImage(item._id)}
                                  />
                                  {permissions[1]?.actions.delete ? (
                                    <button
                                      className="dlt-btn"
                                      type="button"
                                      onClick={() => handleDelete(item._id)}
                                    >
                                      <MdDelete
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={
                                          language === "hindi"
                                            ? "Click to Delete"
                                            : "हटाएं"
                                        }
                                      />
                                    </button>
                                  ) : (
                                    <p></p>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                class="align-middle text-center text-sm"
                                colSpan={7}
                              >
                                <div className="no_data_entry">No data</div>
                              </td>
                            </tr>
                          )}

                          <td colSpan={7}>
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
                    ) : (
                      <div className="permission">
                        <h2>You do not have permission to read this data</h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default GetData;
