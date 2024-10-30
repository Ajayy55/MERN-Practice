import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PORT } from "../Api/api";
import { MdDelete } from "react-icons/md";
import "./form.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import GetHouseDetail from "./GetHouseDetail";
import { MdOutlineModeEdit } from "react-icons/md";
import Papa from "papaparse";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "../lib/Layout";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
function HouseData() {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const [houseDetail, setHouseDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const perPage = 10;
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const handleData = async () => {
    try {
      const response = await axios.get(`${PORT}/getHouseDetails`);
      const filterData = await response.data.data.filter(
        (item) => item.society_id === society_id
      );
      setHouseDetails(filterData.reverse());
      setTimeout(() => {
        setLoadingPermission(false);
      }, 800);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleData();
  }, [houseDetail]);

  useEffect(() => {
    const filteredData = houseDetail.filter(
      (item) =>
        item.houseNo?.includes(searchQuery) ||
        item.ownerName?.includes(searchQuery) ||
        item.ownerNameHindi?.includes(searchQuery) ||
        item.blockNumber?.includes(searchQuery) ||
        item.address?.includes(searchQuery) ||
        item.gender?.includes(searchQuery) ||
        item.vehicleInfo?.includes(searchQuery)
    );
    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
    setCurrentPage(1);
  }, [searchQuery, houseDetail]);

  const handleHouseId = (item) => {
    localStorage.setItem("houseId", item);
  };

  const handleDelete = async (id) => {
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
      await axios.delete(`${PORT}/deleteHouseDetails/${id}`);
      setHouseDetails(houseDetail.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "House No.": item.houseNo ? item.houseNo : "Not Added",
        "Owner Name": item.ownerName ? item.ownerName : "Not Added",
        "Contact Number": item.userPhoneNo ? item.userPhoneNo : "Not Added",
        "Block Number": item.blockNumber ? item.blockNumber : "Not Added",
        "Aadhaar Number": item.aadhaarNumber ? item.aadhaarNumber : "Not Added",
        " Email": item.username ? item.username : "Not Added",
        Password: item.password ? item.password : "Not Added",
      }))
    );

    const wscols = [
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 30 },
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
  const exportToCSV = (houseDetail, filename) => {
    const mappedData = houseDetail.map((item) => ({
      "House No.": item.houseNo ? item.houseNo.trim() : "Not Added",
      "Owner Name": item.ownerName ? item.ownerName.trim() : "Not Added",
      "Contact Number": item.userPhoneNo
        ? item.userPhoneNo.trim()
        : "Not Added",
      "Block Number": item.blockNumber ? item.blockNumber.trim() : "Not Added",
      "Aadhaar Number": item.aadhaarNumber
        ? item.aadhaarNumber.trim()
        : "Not Added",
      Email: item.username ? item.username.trim() : "Not Added",
      Password: item.password ? item.password.trim() : "Not Added",
    }));
    const csv = Papa.unparse(mappedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate} `;
    FileSaver.saveAs(blob, `${filename} ${dateTime}.csv`);
  };

  const navigate = useNavigate();
  const handleHouseDetails = () => {
    navigate("/admin/add-house-details");
  };
  const handleEditHouseDetails = (id) => {
    navigate(`/admin/Edit-house-details/${id}`);
  };

  const [loadingPermission, setLoadingPermission] = useState(true);
  //import HouseList
  const importHouseList = () => {
    navigate("/admin/importHouseList");
  };
  const handleDataChange = () => {
    setIsDataChanged(!isDataChanged);
  };
  // handle  To Set Status
  const handleStatusChange = async (houseId, approvalStatus) => {
    const data = {
      houseId: houseId,
      approvalStatus: approvalStatus,
      approvedBy: society_id,
    };
    try {
      const res = await axios.post(
        `${PORT}/approveHouseOwnerBySocietyAdmin`,
        data
      );
      toast.success(res.data.message);
      handleData();
    } catch (error) {
      toast.success(error.response.data.message);
    }
  };

  return (
    <Layout>
      <>
        <div class="container-fluid py-4 ">
          <div class="row">
            <div class="col-12  ">
              <div class="card mb-4">
                <div class="card-header pb-0">
                  <div className="filtered-div">
                    <div className="p-export-btn export-dropdown">
                      {" "}
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
                              className="export_btn_data"
                              onClick={() =>
                                exportToExcel(filteredData, "HouseData")
                              }
                            >
                              Excel
                            </button>
                            <button
                              className="export_btn_data"
                              onClick={() =>
                                exportToCSV(filteredData, "HouseData")
                              }
                            >
                              CSV
                            </button>
                            <button
                              className="export_btn_data"
                              onClick={importHouseList}
                            >
                              Import
                            </button>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>

                    {permissions[4]?.actions.create ? (
                      <div className="add-item-button_purpose">
                        <button
                          className="add-item-button"
                          onClick={handleHouseDetails}
                        >
                          {language === "hindi" ? "  Add +" : "+ जोड़ें"}
                        </button>
                      </div>
                    ) : (
                      <p></p>
                    )}

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
                              borderColor: " #5e72e4",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: " #5e72e4",
                            },

                            "& .MuiInputLabel-root.Mui-error": {
                              color: "#5e72e4",
                            },
                          },
                        }}
                      >
                        <TextField
                          id="search-input"
                          label={language === "hindi" ? "Search..." : "खोज..."}
                          variant="outlined"
                          value={searchQuery}
                          onChange={handleSearchInput}
                          className="search-input"
                        />
                      </Box>
                    </div>
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
                    ) : permissions[4]?.actions.read ? (
                      <table class="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? "  House No."
                                : "मकान नंबर"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? "Block No."
                                : "ब्लॉक संख्या"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Status" : "स्थिति"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? " Actions" : "कार्रवाई"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentPageData.length > 0 ? (
                            currentPageData.map((item, index) => (
                              <tr key={index}>
                                <td className=" align-middle text-center">
                                  {item.houseNo}
                                </td>{" "}
                                <td className=" align-middle text-center">
                                  {item.blockNumber}
                                </td>
                                <td className=" align-middle text-center">
                                  <span
                                    style={{
                                      color:
                                        item.approvalStatus === "approved"
                                          ? "green"
                                          : item.approvalStatus === "rejected"
                                          ? "red"
                                          : "orange", // color for "pending"
                                      fontWeight: "bold", // Make it bold for emphasis
                                    }}
                                  >
                                    {item.approvalStatus.toUpperCase()}
                                  </span>
                                </td>
                                <td className="align-middle gap-2 text-center  d-flex justify-content-center ">
                                  {item.approvalStatus === "approved" ? (
                                    <Tooltip
                                      title={
                                        language === "hindi"
                                          ? "Rejected"
                                          : "अस्वीकृत"
                                      }
                                      placement="top"
                                      arrow
                                    >
                                      <button
                                        className="edit-btn"
                                        onClick={() =>
                                          handleStatusChange(
                                            item._id,
                                            "rejected"
                                          )
                                        }
                                      >
                                        <FaTimesCircle className="eyes_view" />
                                      </button>
                                    </Tooltip>
                                  ) : item.approvalStatus === "rejected" ? (
                                    <Tooltip
                                      title={
                                        language === "hindi"
                                          ? "Approved"
                                          : "स्वीकृत"
                                      }
                                      placement="top"
                                      arrow
                                    >
                                      <button
                                        className="edit-btn"
                                        onClick={() =>
                                          handleStatusChange(
                                            item._id,
                                            "approved"
                                          )
                                        }
                                      >
                                        <FaCheckCircle className="eyes_view" />
                                      </button>
                                    </Tooltip>
                                  ) : (
                                    <>
                                      <Tooltip
                                        title={
                                          language === "hindi"
                                            ? "Rejected"
                                            : "अस्वीकृत"
                                        }
                                        placement="top"
                                        arrow
                                      >
                                        <button
                                          className="edit-btn"
                                          onClick={() =>
                                            handleStatusChange(
                                              item._id,
                                              "rejected"
                                            )
                                          }
                                        >
                                          <FaTimesCircle className="eyes_view" />
                                        </button>
                                      </Tooltip>
                                      <Tooltip
                                        title={
                                          language === "hindi"
                                            ? "Approved"
                                            : "स्वीकृत"
                                        }
                                        placement="top"
                                        arrow
                                      >
                                        <button
                                          className="edit-btn"
                                          onClick={() =>
                                            handleStatusChange(
                                              item._id,
                                              "approved"
                                            )
                                          }
                                        >
                                          <FaCheckCircle className="eyes_view" />
                                        </button>
                                      </Tooltip>
                                    </>
                                  )}

                                  {/* Reject Button */}

                                  <GetHouseDetail
                                    item={item}
                                    onDataChange={handleDataChange}
                                  />
                                  {permissions[4]?.actions.edit ? (
                                    <Tooltip
                                      title={
                                        language === "hindi"
                                          ? "Click to Edit"
                                          : "संपादित करें"
                                      }
                                      placement="top"
                                      arrow
                                    >
                                      <button
                                        onClick={() =>
                                          handleEditHouseDetails(item._id)
                                        }
                                        className="edit-btn"
                                      >
                                        <MdOutlineModeEdit
                                          data-toggle="tooltip"
                                          className="eyes_view"
                                        />
                                      </button>
                                    </Tooltip>
                                  ) : (
                                    <p></p>
                                  )}
                                  {permissions[4]?.actions.delete ? (
                                    <Tooltip
                                      title={
                                        language === "hindi"
                                          ? "Click to Delete"
                                          : "हटाएं"
                                      }
                                      placement="top"
                                      arrow
                                    >
                                      <button
                                        onClick={() => handleDelete(item._id)}
                                        className="dlt-btn"
                                      >
                                        <MdDelete
                                          data-toggle="tooltip"
                                          className="eyes_view"
                                        />
                                      </button>
                                    </Tooltip>
                                  ) : (
                                    <p></p>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7}>
                                <div className="no_data_entry">No data</div>
                              </td>
                            </tr>
                          )}
                          <tr>
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
                          </tr>
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
        <ToastContainer />
      </>
    </Layout>
  );
}

export default HouseData;
