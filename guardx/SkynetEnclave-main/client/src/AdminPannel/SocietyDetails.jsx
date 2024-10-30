import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { MdDelete } from "react-icons/md";
import "./society.css";
import AddSociety from "./AddSociety";
import axios from "axios";
import { PORT } from "../Api/api";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Swal from "sweetalert2";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import GetSocietyDetails from "./GetSocietyDetails";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import { FaHouseUser } from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThreeCircles } from "react-loader-spinner";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import CommonNav from "../AdminSetting/CommonNav";
import Layout from "../lib/Layout";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import { MdOutlineModeEdit } from "react-icons/md";
import { formatDate } from "../lib/FormattedDate";
const SocietyDetails = () => {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const [societyData, setSocietyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const perPage = 10;
  const navigate = useNavigate();
  const handleSociety = () => {
    navigate("/admin/add-society");
  };
  const getSocietyData = async () => {
    try {
      const response = await axios.get(`${PORT}/getSocietyData`);
      const res = await response.data.societyData;
      const filterData = await res.filter(
        (item) => item.createdBy === getRoleId
      );
      setSocietyData(filterData.reverse());
      setTimeout(() => {
        setLoadingPermission(false);
      }, 1000);

      setFilteredData(filterData);
      setLoading(false);
      const totalItems = filterData.length;
      setTotalPages(Math.ceil(totalItems / perPage));
    } catch (error) {
      console.log("Error fetching society data:", error);
    }
  };

  useEffect(() => {
    getSocietyData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${PORT}/delSociety/${id}`);
        getSocietyData();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log("Error deleting society:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = societyData.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
    setCurrentPage(1);
  };
  //date range
  useEffect(() => {
    let filteredData = societyData;

    if (startDate) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.submitedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.submitedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate <= new Date(endDate);
      });
    }

    if (searchQuery) {
      filteredData = filteredData.filter((item) => {
        return item?.name
          .toLowerCase()
          .trim()
          .includes(searchQuery.trim().toLowerCase());
      });
    }

    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
  }, [societyData, searchQuery, startDate, endDate]);

  const [loadingPermission, setLoadingPermission] = useState(true);
  //Edit Society Functionlaity
  const handleSocietyEditFunctionality = (id) => {
    navigate(`/admin/edit-society/${id}`);
  };
  //Export Data from Excel
  const exportToExcel = (filteredData, filename) => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Society Name": item.name?item.name:"Not Added",
        "Society Address": item.address? item.address:"Not Added",
        "State": item.state? item.state:"Not Added",
        "City": item.city? item.city:"Not Added",
        "Society Contact No.": item.societyContactNumber?item.societyContactNumber:"Not Added",
        "Society Registration No.": item.societyRegistration? item.societyRegistration:"Not Added",
        "Society HouseList": item.societyHouseList?item.societyHouseList:"Not Added",
      }))
    );

    const wscols = [
      { wch: 30 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];
    ws["!cols"] = wscols;
    const wsrows = [
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 20 },
    ];
    ws["!rows"] = wsrows;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate}`;

    FileSaver.saveAs(blob, `${filename} ${dateTime}.xlsx`);
  };
  //Import Society Data
  const exportToImport = () => {
    navigate("/admin/importSocieties");
  };
  return (
    <>
      <Layout>
        <div class="container-fluid py-4 ">
          <div class="row">
            <div class="col-12 ">
              <div class="card mb-4">
                <div class="card-header pb-0">
                  <div className="filtered-div">
                    <div>
                      {permissions[6]?.actions.create ? (
                        <div className="society_add_btn">
                          <button className="" onClick={handleSociety}>
                            {language === "hindi" ? "  Add +" : "+ जोड़ें"}
                          </button>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </div>

                    <div className="p-export-btn-society export-dropdown">
                    
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
                              className="export_society_btn"
                              onClick={() =>
                                exportToExcel(filteredData, "Society Data")
                              }
                            >
                             Excel
                              {/* <TiExport className="export_icon" /> */}
                            </button>
                            <button
                              className="export_society_btn "
                              onClick={exportToImport}
                            >
                              Import
                              {/* <TiExport className="export_icon" /> */}
                            </button>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
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
                          style: { color: "#5e72e4" },
                        }}
                        InputProps={{
                          style: { color: "#5e72e4" },
                        }}
                        variant="outlined"
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
                              borderColor: "#5e72e4",
                            },
                            "& .MuiInputLabel-root.Mui-error": {
                              color: "#5e72e4",
                            },
                          },
                        }}
                      />
                      <TextField
                        id="end-date"
                        label={language === "hindi" ? "End Date" : "अंतिम तिथि"}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                          style: { color: "#5e72e4" },
                        }}
                        InputProps={{
                          style: { color: "#5e72e4" },
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#5e72e4",
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
                      />
                    </div>

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
                              color: "red",
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
                          className="search-input_society"
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
                    ) : permissions[6]?.actions.read ? (
                      <table class="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th class="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? " Society Name"
                                : " सोसायटी का नाम	"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? " Address" : "पता"}
                            </th>
                            <th class="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? " Contact Number"
                                : "संपर्क संख्या"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "    Date" : "तारीख"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Action" : "कार्रवाई"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredData.length > 0 ? (
                            filteredData
                              .slice(
                                (currentPage - 1) * perPage,
                                currentPage * perPage
                              )
                              .map((item, index) => (
                                <tr key={index}>
                                  <td className="align-middle text-center">
                                    {item.name}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.address}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.societyContactNumber}
                                  </td>
                                  <td className="align-middle text-center">
                                    {formatDate(item.submitedDate)}
                                  </td>

                                  <td className="align-middle text-center d-flex justify-content-center ">
                                    <GetSocietyDetails item={item} />
                                    {permissions[6]?.actions.edit ? (
                                      <button
                                        className="edit-btn"
                                        onClick={() =>
                                          handleSocietyEditFunctionality(
                                            item._id
                                          )
                                        }
                                      >
                                        {" "}
                                        <MdOutlineModeEdit
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title={
                                            language === "hindi"
                                              ? "Click to Edit"
                                              : "संपादित करें"
                                          }
                                        />{" "}
                                      </button>
                                    ) : (
                                      <p></p>
                                    )}
                                    {permissions[6]?.actions.delete ? (
                                      <button
                                        className="dlt-btn "
                                        onClick={() => {
                                          handleDelete(item._id);
                                        }}
                                      >
                                        <MdDelete
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title={
                                            language === "hindi"
                                              ? "Delete"
                                              : "हटाएं"
                                          }
                                        />
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={6}>
                                <div className="no_data_entry">No data</div>
                              </td>
                            </tr>
                          )}

                          <td colSpan={6}>
                            {totalPages > 1 && (
                              <div className="table-pagination">
                                <Stack spacing={2}>
                                  <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
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
    </>
  );
};

export default SocietyDetails;
