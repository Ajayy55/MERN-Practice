import React, { useEffect, useState } from "react";
import axios from "axios";
import { PORT } from "../Api/api";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import "./Purpose.css";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThreeCircles } from "react-loader-spinner";
import Papa from "papaparse";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MdOutlineModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../lib/PermissionContext";
import Layout from "../lib/Layout";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { RiSearchLine } from "react-icons/ri";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "./modal.css";
import { Typography } from "@mui/material";
import { TbSelectAll } from "react-icons/tb";
import { AiOutlineSortAscending } from "react-icons/ai";
import { TbSortDescendingLetters } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
function PurposeData() {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const [purposeData, setPurposeData] = useState([]);
  const [purposeDataBySociety, setPurposeDataBySociety] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageBySociety, setCurrentPageBySociety] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesBySociety, setTotalPagesBySoceity] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryBySociety, setSearchQueryBySociety] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataBySociety, setFilteredDataBySociety] = useState([]);
  const perPage = 10;
  const [updatePage, setUpdatePage] = useState(false);
  const [updatePageBySociety, setUpdatePageBySociety] = useState(false);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [loadingPermissionBySociety, setLoadingPermissionBySociety] =
    useState(true);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const role_level = JSON.parse(localStorage.getItem("role")) || null;
  const navigate = useNavigate();
  //handle data By SuperAdmin
  const handleSubmit = async () => {
    try {
      const result = await axios.get(`${PORT}/getUserNonVerfiedPrupose`);
      const responseData = result.data.data;
      const filterData_with_defaultPermissionLevel = responseData?.filter(
        (item) =>
          item?.defaultPermissionLevel === "1" ||
          item?.defaultPermissionLevel === "2"
      );
      setPurposeData(filterData_with_defaultPermissionLevel?.reverse());
      setTimeout(() => {
        setLoadingPermission(false);
      }, 800);

      setTotalPages(
        Math.ceil(filterData_with_defaultPermissionLevel?.length / perPage)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingPermission(false);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, purposeData?.length);
  const currentPageData =
    filteredData?.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : purposeData.slice(startIndex, endIndex);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredData = purposeData.filter(
      (item) =>
        item.purpose.toLowerCase().includes(query.toLowerCase()) ||
        item.purpose.toUpperCase().includes(query.toUpperCase())
    );
    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData?.length / perPage));
    setCurrentPage(1);
  };
  useEffect(() => {
    setFilteredData(purposeData);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(purposeData);
      setTotalPages(Math.ceil(purposeData.length / perPage));
    }
  }, [searchQuery, purposeData, updatePage]);
  //handle data By Society Admin
  const handleDataSocietyAdmin = async () => {
    try {
      const result = await axios.get(`${PORT}/getUserNonVerfiedPrupose`);
      const responseData = result.data.data;
      const filterData = responseData.filter(
        (item) => item.society_id === society_id
      );
      setPurposeDataBySociety(filterData.reverse());
      setTimeout(() => {
        setLoadingPermissionBySociety(false);
      }, 300);
      setTotalPagesBySoceity(Math.ceil(filterData.length / perPage));
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoadingPermissionBySociety(false);
    }
  };

  useEffect(() => {
    handleDataSocietyAdmin();
  }, []);
  const handleChangePageBySociety = (event, value) => {
    setCurrentPageBySociety(value);
  };
  const startIndexBySociety = (currentPageBySociety - 1) * perPage;
  const endIndexBySociety = Math.min(
    startIndexBySociety + perPage,
    purposeDataBySociety.length
  );
  const currentPageDataBySociety =
    filteredDataBySociety.length > 0
      ? filteredDataBySociety.slice(startIndexBySociety, endIndexBySociety)
      : purposeDataBySociety.slice(startIndexBySociety, endIndexBySociety);
  const handleSearchInputBySociety = (e) => {
    const query = e.target.value;
    setSearchQueryBySociety(query);
    const filteredData = purposeDataBySociety.filter((item) =>
      item.purpose.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDataBySociety(filteredData);
    setTotalPagesBySoceity(Math.ceil(filteredData.length / perPage));
    setCurrentPageBySociety(1);
  };
  useEffect(() => {
    setFilteredDataBySociety(purposeDataBySociety);
  }, []);

  useEffect(() => {
    if (!searchQueryBySociety) {
      setFilteredDataBySociety(purposeDataBySociety);
      setTotalPagesBySoceity(Math.ceil(purposeDataBySociety.length / perPage));
    }
  }, [searchQueryBySociety, purposeDataBySociety, updatePageBySociety]);
  const addEntryByDropDown = async (items) => {
    setOpen(false);
    const entriesArray = Array.isArray(items) ? items : [items];
    try {
      setLoadingPermissionBySociety(true);

      const csvHeaders = [
        "purpose",
        "purposeIcon",
        "createdBy",
        "created_by_edit",
      ];
      const csvRows = entriesArray.map((item) => [
        item.purpose,
        item.purposeIcon,
        item.createdBy,
        item.created_by_edit,
      ]);
      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const formData = new FormData();
      formData.append("purposeCsv", blob);
      formData.append("society_id", society_id);
      await axios.post(`${PORT}/purposeImportFormCsv`, formData).then((res) => {
        const successMessage = res.data.msg;
        const existingTitles = res.data.existingPurposeTitles;
        if (existingTitles.length > 0) {
          toast.success(`${successMessage}. Some Purpose already exist.`);
        } else {
          toast.success(successMessage);
        }
      });
      setTimeout(() => {
        setValue(null);
        setInputValue("");
      }, 1300);
      handleDataSocietyAdmin();
      setLoadingPermissionBySociety(false);
      setSelectedEntries([]);
      setFilterType("");
      setQuerySearchByModalEntries("");
    } catch (error) {
      toast.error(error.response.data.msg);
      setLoadingPermissionBySociety(false);
    }
  };
  //handle delete functionality
  const handleDeletePurpose = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to Delete this Data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!",
        customClass: {
          container: "my-swal",
        },
      });

      if (result.isConfirmed) {
        await axios.delete(`${PORT}/delPurposeBySuperAdmin/${id}`);
        handleSubmit();
        setUpdatePage((prevState) => !prevState);

        Swal.fire({
          title: "Deleted!",
          text: "Your Purpose Is Deleted",
          icon: "success",
        });
      } else {
        console.log("Your Data Is Not Deleted ");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleDeletePurposeBySociety = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to Delete this Data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!",
        customClass: {
          container: "my-swal",
        },
      });

      if (result.isConfirmed) {
        await axios.delete(`${PORT}/delPurposeDataByAdmin/${id}`);
        handleDataSocietyAdmin();
        setUpdatePageBySociety((prevState) => !prevState);

        Swal.fire({
          title: "Deleted!",
          text: "Your Purpose Is Deleted",
          icon: "success",
        });
      } else {
        console.log("Your Data Is Not Deleted ");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  //Export Data From Excel
  const exportToExcel = (purposeData, filename) => {
    const ws = XLSX.utils.json_to_sheet(
      purposeData.map((item) => ({
        Purpose: item.purpose,
      }))
    );

    const wscols = [{ wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }];
    ws["!cols"] = wscols;

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
  //Export Data From Csv
  const exportToCSV = (data, filename) => {
    const filteredData = data.map((item) => ({
      Purpose: item.purpose,
    }));

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate} `;
    FileSaver.saveAs(blob, `${filename}${dateTime}.csv`);
  };

  const handleAddPurpose = () => {
    navigate("/admin/purpose-add");
  };
  // import PurposeHandle
  const importPurposeHandle = () => {
    navigate("/admin/importPurpose");
  };
  const handleEditPurpose = async (id) => {
    navigate(`/admin/edit-purpose/${id}`);
  };
  //Add Open Modal Functionlaity
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFilterType("");
    setQuerySearchByModalEntries("");
    setSelectedEntries("");
  };
  // Search Functionality By Modal Entries
  const [querySearchByModalEntries, setQuerySearchByModalEntries] =
    useState("");
  const filteredDataByModalEntries = purposeData?.filter((item) =>
    item.purpose
      ?.toLowerCase()
      .includes(querySearchByModalEntries.toLowerCase())
  );
  //Open Menu Filter  Functionality
  const [filterType, setFilterType] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredEntries = filteredDataByModalEntries?.sort((a, b) => {
    const aValue = a.purpose.replace(/[^0-9.-]+/g, "");
    const bValue = b.purpose.replace(/[^0-9.-]+/g, "");

    const aValueAsNumber = parseFloat(aValue);
    const bValueAsNumber = parseFloat(bValue);
    if (!isNaN(aValueAsNumber) && !isNaN(bValueAsNumber)) {
      return filterType === "ascending"
        ? aValueAsNumber - bValueAsNumber
        : bValueAsNumber - aValueAsNumber;
    }
    return filterType === "ascending"
      ? a.purpose.localeCompare(b.purpose)
      : b.purpose.localeCompare(a.purpose);
  });

  const clearFilter = () => {
    setFilterType("");
    setQuerySearchByModalEntries("");
    setSelectedEntries("");
  };

  const handleEntryClick = (item) => {
    const itemId = item._id.toString();
    const isSelected = selectedEntries.includes(itemId);

    if (isSelected) {
      // Deselect the entry
      setSelectedEntries(selectedEntries.filter((id) => id !== itemId));
    } else {
      // Select the entry
      setSelectedEntries([...selectedEntries, itemId]);
    }
    const allEntries = filteredEntries.map((entry) => entry._id.toString());
    setAllSelected(selectedEntries.length === allEntries.length);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedEntries([]);
    } else {
      const allEntryIds = filteredEntries.map((entry) => entry._id.toString());
      setSelectedEntries(allEntryIds);
    }
    setAllSelected(!allSelected);
  };
  const handleAddAllEntries = async () => {
    const entriesToAdd = selectedEntries
      .map((entryId) =>
        filteredEntries.find((item) => item._id.toString() === entryId)
      )
      .filter((item) => item !== undefined);
    if (entriesToAdd.length > 0) {
      const result = await Swal.fire({
        title: "Are you sure you want to add these Purpose?",
        text: "This will add all selected entries.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add them!",
        customClass: {
          container: "my-swal-modal",
        },
      });

      if (result.isConfirmed) {
        try {
          setLoadingPermissionBySociety(true);
          addEntryByDropDown(entriesToAdd);
          setTimeout(() => {
            setValue(null);
            setInputValue("");
          }, 1300);
          handleDataSocietyAdmin();
          setOpen(false);
          setSelectedEntries([]);
          setFilterType("");
          setQuerySearchByModalEntries("");
        } catch (error) {
          console.error("Error adding entries:", error);
        } finally {
          setLoadingPermissionBySociety(false);
        }
      } else {
        setOpen(false);
      }
    }
  };
  return (
    <>
      <Layout>
        <div class="container-fluid py-4 ">
          <div class="row">
            {(role_level === 1 || role_level === 2) && (
              <div class="col-12  ">
                <div class="card mb-4">
                  <div class="card-header pb-0">
                    <div className="filtered-div">
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
                                className="export_btn_data"
                                onClick={() =>
                                  exportToExcel(
                                    filteredData,
                                    "Purpose of Occasional"
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
                                    "Purpose of Occasional "
                                  )
                                }
                              >
                                CSV
                              </button>
                              <button
                                className="export_btn_data"
                                onClick={importPurposeHandle}
                              >
                                Import
                              </button>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div>
                        {permissions[3]?.actions.create ? (
                          <div className="add-item-button_purpose">
                            <button
                              className="add-item-button"
                              onClick={handleAddPurpose}
                            >
                              {language === "hindi" ? "Add +" : "+ जोड़ें"}
                            </button>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </div>
                      <div className="search-filter-box">
                        <Box
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: " ##5e72e4",
                                borderWidth: "1px",
                                borderRadius: "5px",
                              },
                              "&:hover fieldset": {
                                borderColor: " ##5e72e4",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: " ##5e72e4",
                              },

                              "& .MuiInputLabel-root.Mui-error": {
                                color: "#5e72e4",
                              },
                            },
                          }}
                        >
                          <TextField
                            id="search-input"
                            label={
                              language === "hindi" ? "Search..." : "खोज..."
                            }
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
                      ) : permissions[3]?.actions.read ? (
                        <table className="table align-items-center mb-0">
                          <thead>
                            <tr>
                              <th className=" text-dark text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "   Purpose Icon"
                                  : "   उद्देश्य चिह्न"}
                              </th>
                              <th className=" text-dark  text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "  Purpose Type"
                                  : "उद्देश्य प्रकार"}
                              </th>
                              <th className=" text-dark  text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "Linked entry"
                                  : "लिंक किया गया प्रविष्टि"}
                              </th>

                              <th className=" text-dark  text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "  Action"
                                  : " कार्रवाई"}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredData?.length > 0 ? (
                              currentPageData.map((item, index) => (
                                <tr key={index}>
                                  <td className="align-middle text-center  ">
                                    {item?.purposeIcon?.length > 0 ? (
                                      item.purposeIcon && (
                                        <div className="align-middle text-center">
                                          <img
                                            src={`/${item.purposeIcon.replace(
                                              "public/",
                                              ""
                                            )}`}
                                            alt=""
                                            className="purpose_image_icon"
                                          />
                                        </div>
                                      )
                                    ) : (
                                      <h6>
                                        {
                                          <>
                                            {(() => {
                                              let words;

                                              words = item.purpose?.split(" ");

                                              const initials = words[0]
                                                .substring(0, 1)
                                                .toUpperCase();

                                              return (
                                                <>
                                                  <div className="align-middle text-center purpose_icon_title ">
                                                    <h5 className="initialss ">
                                                      {initials}
                                                    </h5>
                                                  </div>
                                                </>
                                              );
                                            })()}
                                          </>
                                        }
                                      </h6>
                                    )}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.purpose}{" "}
                                  </td>
                                  <td className="align-middle text-center">
                                {item.linkedEntry?item.linkedEntry:"Not added"}{" "}
                                  </td>
                                  <td className="align-middle text-center">
                                    {permissions[3]?.actions.edit ? (
                                      <button
                                        className="edit-btn"
                                        onClick={() =>
                                          handleEditPurpose(
                                            item.created_by_edit
                                          )
                                        }
                                      >
                                        <MdOutlineModeEdit
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title={
                                            language === "hindi"
                                              ? "Click to Edit"
                                              : "संपादित करें"
                                          }
                                        />
                                      </button>
                                    ) : (
                                      <p></p>
                                    )}

                                    {permissions[3]?.actions.delete ? (
                                      <button
                                        className="edit-btn"
                                        onClick={() =>
                                          handleDeletePurpose(item && item._id)
                                        }
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
                                <td colSpan={4}>
                                  <div className="no_data_entry">No data</div>
                                </td>
                              </tr>
                            )}
                            <td colSpan={4}>
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
            )}
            {(role_level === 4 || role_level === 5) && (
              <div class="col-12  ">
                <div class="card mb-4">
                  <div class="card-header pb-0">
                    <div className="filtered-div">
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
                                className="export_btn_data"
                                onClick={() =>
                                  exportToExcel(
                                    filteredDataBySociety,
                                    "Purpose of Occasional"
                                  )
                                }
                              >
                                Excel
                              </button>
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToCSV(
                                    filteredDataBySociety,
                                    "Purpose of Occasional "
                                  )
                                }
                              >
                                CSV
                              </button>
                              {role_level === 1 && (
                                <button
                                  className="export_btn_data"
                                  onClick={importPurposeHandle}
                                >
                                  Import
                                </button>
                              )}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div className="search-filter-box">
                        <Box
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: " ##5e72e4",
                                borderWidth: "1px",
                                borderRadius: "5px",
                              },
                              "&:hover fieldset": {
                                borderColor: " ##5e72e4",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: " ##5e72e4",
                              },

                              "& .MuiInputLabel-root.Mui-error": {
                                color: "#5e72e4",
                              },
                            },
                          }}
                        >
                          <TextField
                            id="search-input"
                            label={
                              language === "hindi" ? "Search..." : "खोज..."
                            }
                            variant="outlined"
                            value={searchQueryBySociety}
                            onChange={handleSearchInputBySociety}
                            className="search-input"
                          />
                        </Box>
                      </div>
                      <>
                        <div>
                          <div>
                            {permissions[3]?.actions.create ? (
                              <div className="add-item-button_purpose">
                                <button
                                  className="add-item-button"
                                  onClick={handleClickOpen}
                                >
                                  {language === "hindi" ? "Add +" : "+ जोड़ें"}
                                </button>
                              </div>
                            ) : (
                              <p></p>
                            )}
                          </div>
                          <Dialog
                            onClose={handleClose}
                            className="details-dialog"
                            aria-labelledby="customized-dialog-title"
                            open={open}
                            maxWidth="sm"
                            fullWidth={true}
                          >
                            <DialogTitle
                              sx={{ m: 0, p: 2 }}
                              id="customized-dialog-title"
                            >
                              {language === "english"
                                ? "उद्देश्य जोड़ें"
                                : " Add Purpose"}
                            </DialogTitle>
                            <IconButton
                              aria-label="close"
                              onClick={handleClose}
                              sx={(theme) => ({
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: theme.palette.grey[500],
                              })}
                            >
                              <CloseIcon />
                            </IconButton>
                            <DialogContent dividers>
                              <div
                                className="filter_div "
                                id="customized-dialog-title"
                              >
                                <div className="filter-clear">
                                  <div>
                                    <DropdownButton
                                      className="dropdown_btn mt-3"
                                      title={
                                        <span>
                                          {language === "english"
                                            ? "फ़िल्टर"
                                            : "Filter"}
                                        </span>
                                      }
                                    >
                                      <Dropdown.Item
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleFilterChange("ascending");
                                        }}
                                      >
                                        <label className="label_modal">
                                          <AiOutlineSortAscending className="ci_filter" />
                                          &nbsp;
                                          {language === "english"
                                            ? "आरोही"
                                            : "Ascending"}
                                        </label>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleFilterChange("descending");
                                        }}
                                      >
                                        <label className="label_modal">
                                          <TbSortDescendingLetters className="ci_filter" />
                                          &nbsp;
                                          {language === "english"
                                            ? "अवरोही"
                                            : "Descending"}
                                        </label>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        as="div"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectAll();
                                        }}
                                      >
                                        <label className="label_modal">
                                          <TbSelectAll className="ci_filter" />
                                          &nbsp;
                                          {language === "english"
                                            ? "सभी चयन करें"
                                            : " Select all"}
                                        </label>
                                      </Dropdown.Item>
                                    </DropdownButton>
                                  </div>
                                  <div className="clear-filter">
                                    <button
                                      className="dropdown_btn mt-3"
                                      onClick={clearFilter}
                                    >
                                      {language === "english"
                                        ? "साफ़"
                                        : "Clear"}
                                    </button>
                                  </div>
                                </div>
                                <div className="calender-search-entry">
                                  <div className="search_filter_calender_content">
                                    <div className="search-input-wrapper">
                                      <input
                                        type="text"
                                        placeholder={
                                          language === "english"
                                            ? "नाम से खोजें"
                                            : "Search by name"
                                        }
                                        id="Customer"
                                        value={querySearchByModalEntries}
                                        onChange={(e) =>
                                          setQuerySearchByModalEntries(
                                            e.target.value
                                          )
                                        }
                                        name="name"
                                        autoComplete="off"
                                      />
                                      <RiSearchLine className="search-icon-entry" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Typography gutterBottom>
                                <div className="modal-entries">
                                  {loadingPermissionBySociety ? (
                                    <div className="three_circle_loader">
                                      <ThreeCircles
                                        visible={true}
                                        height={100}
                                        width={100}
                                        color="#5e72e4"
                                        ariaLabel="three-circles-loading"
                                      />
                                    </div>
                                  ) : filteredEntries.length > 0 ? (
                                    filteredEntries &&
                                    filteredEntries.map((item, index) => {
                                      return (
                                        <>
                                          <div
                                            key={item._id.toString()}
                                            className={`modal-entry  ${
                                              selectedEntries.includes(
                                                item._id.toString()
                                              )
                                                ? "selected"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleEntryClick(item)
                                            }
                                            id="modal-entry"
                                          >
                                            <div className="modal-image">
                                              {item.purposeIcon ? (
                                                <img
                                                  src={`/${item.purposeIcon.replace(
                                                    "public/",
                                                    ""
                                                  )}`}
                                                  alt=""
                                                />
                                              ) : (
                                                <div className="modal-placeholder">
                                                  <div className="modal-image-div">
                                                    <b className="modal-word">
                                                      {item.purpose
                                                        ?.charAt(0)
                                                        .toUpperCase() || ""}
                                                    </b>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <p className="modal-name">
                                              {item.purpose}
                                            </p>
                                          </div>
                                        </>
                                      );
                                    })
                                  ) : (
                                    <div className="no-data-modal">No Data</div>
                                  )}
                                </div>
                              </Typography>
                            </DialogContent>
                            <DialogActions>
                              {selectedEntries && (
                                <button
                                  onClick={handleAddAllEntries}
                                  className="modal-button"
                                  type="submit"
                                  disabled={selectedEntries.length === 0}
                                >
                                  {language === "hindi"
                                    ? "Submit"
                                    : " प्रस्तुत करें "}
                                </button>
                              )}
                            </DialogActions>
                          </Dialog>
                        </div>
                      </>
                    </div>
                  </div>
                  <div class="card-body px-0 pt-0 pb-2 w-100">
                    <div class="table-responsive p-0">
                      {loadingPermissionBySociety ? (
                        <div className="three_circle_loader">
                          <ThreeCircles
                            visible={true}
                            height={100}
                            width={100}
                            color="#5e72e4"
                            ariaLabel="three-circles-loading"
                          />
                        </div>
                      ) : permissions[3]?.actions.read ? (
                        <table className="table align-items-center mb-0">
                          <thead>
                            <tr>
                           
                              <th className=" text-dark text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "   Purpose Icon"
                                  : "   उद्देश्य चिह्न"}
                              </th>
                              <th className=" text-dark  text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "  Purpose Type"
                                  : "उद्देश्य प्रकार"}
                              </th>
                              <th className=" text-dark  text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? "  Action"
                                  : " कार्रवाई"}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredDataBySociety.length > 0 ? (
                              currentPageDataBySociety.map((item, index) => (
                                <tr key={index}>
                                       <td className="align-middle text-center  ">
                                    {item.purposeIcon.length > 0 ? (
                                      item.purposeIcon && (
                                        <div className="align-middle text-center">
                                          <img
                                            src={`/${item.purposeIcon.replace(
                                              "public/",
                                              ""
                                            )}`}
                                            alt=""
                                            className="purpose_image_icon"
                                          />
                                        </div>
                                      )
                                    ) : (
                                      <h6>
                                        {
                                          <>
                                            {(() => {
                                              let words;

                                              words = item.purpose?.split(" ");

                                              const initials = words[0]
                                                .substring(0, 1)
                                                .toUpperCase();

                                              return (
                                                <>
                                                  <div className="align-middle text-center purpose_icon_title ">
                                                    <h5 className="initialss ">
                                                      {initials}
                                                    </h5>
                                                  </div>
                                                </>
                                              );
                                            })()}
                                          </>
                                        }
                                      </h6>
                                    )}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.purpose}{" "}
                                  </td>
                             

                                  <td className="actions align-middle text-center">
                                    {/* <button
                                      className="edit-btn"
                                      onClick={() =>
                                        handleEditPurpose(item._id)
                                      }
                                      disabled={!permissions[3]?.actions.edit}
                                    >
                                      <MdOutlineModeEdit
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={
                                          language === "hindi"
                                            ? "Click to Edit"
                                            : "संपादित करें"
                                        }
                                      />
                                    </button> */}

                                    <button
                                      className="edit-btn"
                                      onClick={() =>
                                        handleDeletePurposeBySociety(
                                          item && item._id
                                        )
                                      }
                                      disabled={!permissions[3]?.actions.delete}
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
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3}>
                                  <div className="no_data_entry">No data</div>
                                </td>
                              </tr>
                            )}
                            <td colSpan={3}>
                              {totalPagesBySociety > 1 && (
                                <div className="table-pagination">
                                  <Stack spacing={2}>
                                    <Pagination
                                      count={totalPagesBySociety}
                                      page={currentPageBySociety}
                                      onChange={handleChangePageBySociety}
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
            )}
          </div>
        </div>
        <ToastContainer />
      </Layout>
    </>
  );
}

export default PurposeData;
