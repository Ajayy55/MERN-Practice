import React, { useEffect, useState } from "react";
import axios from "axios";
import { PORT } from "../Api/api";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { ThreeCircles } from "react-loader-spinner";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { TiExport } from "react-icons/ti";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./nav.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./export-button.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineModeEdit } from "react-icons/md";
import Layout from "../lib/Layout";
import { useContext } from "react";
import { PermissionContext } from "../lib/PermissionContext";
import { DataContext } from "../lib/DataContext";
import { LanguageContext } from "../lib/LanguageContext";
import { Typography } from "@mui/material";
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
import { ToastContainer, toast } from "react-toastify";
import { TbSelectAll } from "react-icons/tb";
import { formatDate } from "../lib/FormattedDate";
function EntryData() {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const { addItem, removeItem, updateItem } = useContext(DataContext);
  const [userData, setUserData] = useState([]);
  const [userDataBySociety, setUserDataBySociety] = useState([]);
  const [totalPagesBySoceity, setTotalPagesBySoceity] = useState([]);
  const [currentPageBySociety, setCurrentPageBySociety] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryBySociety, setSearchQueryBySociety] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataBySoceity, setFilteredDataBySociety] = useState([]);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [loadingPermissionBySociety, setLoadingPermissionBySociety] =
    useState(true);
  const [updatePageBySociety, setUpdatePageBySociety] = useState(false);
  const [updatePage, setUpdatePage] = useState(false);
  const perPage = 10;
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const role_level = JSON.parse(localStorage.getItem("role")) || null;
  const getEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const filterData = response.data.data;
      const filterData_with_defaultPermissionLevel = filterData?.filter(
        (item) =>
          item?.defaultPermissionLevel === "1" ||
          item?.defaultPermissionLevel === "2"
      );
      setTimeout(() => {
        setLoadingPermission(false);
      }, 800);

      setUserData(filterData_with_defaultPermissionLevel.reverse());
      setTotalPages(
        Math.ceil(filterData_with_defaultPermissionLevel.length / perPage)
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getEntriesBySociety = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const filterData = response.data.data.filter(
        (item) => item.society_id === society_id
      );
      setTimeout(() => {
        setLoadingPermissionBySociety(false);
      }, 300);
      setUserDataBySociety(filterData.reverse());
      setTotalPagesBySoceity(Math.ceil(filterData.length / perPage));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEntries();
  }, []);
  useEffect(() => {
    getEntriesBySociety();
  }, []);
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };
  const handleChangePageBySociety = (event, value) => {
    setCurrentPageBySociety(value);
  };

  const navigate = useNavigate();

  const handleId = (id) => {
    navigate(`/admin/edit-entry/${id}`);
  };

  const exportToExcel = (data, filename) => {
    const filteredData = data.map(
      ({ titleEnglish, entryType, joiningDate }) => ({
        "Entry Name": titleEnglish,
        "Entry Type": entryType,
        Date: joiningDate,
      })
    );

    const ws = XLSX.utils.json_to_sheet(filteredData);

    const wscols = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
    ws["!cols"] = wscols;
    // Set row heights
    const rowHeights = [{ hpt: 30 }, ...filteredData.map(() => ({ hpt: 20 }))];
    ws["!rows"] = rowHeights;

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
      ({ titleEnglish, entryType, joiningDate }) => ({
        "Entry Name": titleEnglish,
        "Entry Type": entryType,
        Date: joiningDate,
      }),
      {}
    );

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate} `;
    FileSaver.saveAs(blob, `${filename}${dateTime}.csv`);
  };
  //Pagination handle By Society
  const handleSearchInputBySociety = (event) => {
    setSearchQueryBySociety(event.target.value);
    const query = event.target.value;
    const filteredDataEntry = userDataBySociety.filter(
      (item) =>
        item.titleEnglish.toLowerCase().includes(query.toLowerCase()) ||
        item.entryType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDataBySociety(filteredDataEntry);
    setTotalPagesBySoceity(Math.ceil(filteredDataEntry.length / perPage));
    setCurrentPageBySociety(1);
  };

  useEffect(() => {
    if (!searchQueryBySociety) {
      setFilteredDataBySociety(userDataBySociety);
      setTotalPagesBySoceity(Math.ceil(userDataBySociety.length / perPage));
    }
  }, [searchQueryBySociety, userDataBySociety, updatePageBySociety]);

  const startIndexBySociety = (currentPageBySociety - 1) * perPage;
  const endIndexBySociety = Math.min(
    startIndexBySociety + perPage,
    filteredDataBySoceity.length
  );
  const currentPageDataBySociety =
    filteredDataBySoceity.length > 0
      ? filteredDataBySoceity.slice(startIndexBySociety, endIndexBySociety)
      : filteredDataBySoceity.slice(startIndexBySociety, endIndexBySociety);
  const handleDeleteBySociety = async (id) => {
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

    if (!result.isConfirmed) return;
    try {
      await removeItem(id);
      await axios.delete(`${PORT}/delEntryByAdmin/${id}`).then(() => {
        setUpdatePageBySociety((prevState) => !prevState);
        setUserDataBySociety(
          userDataBySociety.filter((item) => item._id !== id)
        );
        Swal.fire({
          title: "Deleted!",
          text: "Entry has been deleted.",
          icon: "success",
        });
        getEntriesBySociety();
      });
    } catch (error) {
      console.log(error);
    }
  };
  //Pagination handle By Superadmin
  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value;
    const filteredDataEntry = userData.filter(
      (item) =>
        item.titleEnglish.toLowerCase().includes(query.toLowerCase()) ||
        item.entryType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredDataEntry);
    setTotalPages(Math.ceil(filteredDataEntry.length / perPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(userData);
      setTotalPages(Math.ceil(userData.length / perPage));
    }
  }, [searchQuery, userData, updatePage]);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredData.length);
  const currentPageData =
    filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : filteredData.slice(startIndex, endIndex);
  const handleDelete = async (id) => {
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

    if (!result.isConfirmed) return;
    try {
      await removeItem(id);
      await axios.delete(`${PORT}/delEntryBySuperAdmin/${id}`).then(() => {
        setUpdatePage((prevState) => !prevState);
        setUserData(userData.filter((item) => item._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Entry has been deleted.",
          icon: "success",
        });
        getEntries();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddEntry = () => {
    navigate("/admin/entry-add");
  };
  const handleImportExportFunctionality = () => {
    navigate("/admin/importEntries");
  };
  //Add Data By SocietyAdmin
  const addEntryByDropDown = async (items) => {
    const entriesArray = Array.isArray(items) ? items : [items];
    try {
      const csvHeaders = [
        "titleEnglish",
        "entryType",
        "icon",
        "createdBy",
        "created_by_edit",
      ];
      const csvRows = entriesArray.map((item) => [
        item.titleEnglish,
        item.entryType,
        item.icon,
        item._id,
        item.created_by_edit,
      ]);
      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const formData = new FormData();
      formData.append("entriesCsv", blob);
      formData.append("society_id", society_id);
      await axios.post(`${PORT}/entriesImportFormCsv`, formData).then((res) => {
        setLoadingPermissionBySociety(true);
        const successMessage = res.data.msg;
        const existingTitles = res.data.existingTitles;
        if (existingTitles.length > 0) {
          toast.success(`${successMessage}. Some Entries already exist.`);
          addItem(res.data.result);
        } else {
          addItem(res.data.result);
          toast.success(successMessage);
        }
      });

      setTimeout(() => {
        setValue(null);
        setInputValue("");
      }, 1300);
      getEntriesBySociety();
      setOpen(false);
      setSelectedEntries([]);
      setFilterType("");
      setQuerySearchByModalEntries("");
    } catch (error) {
      console.error("Error adding entry:", error.response);
      setLoadingPermissionBySociety(false);
      const successMessage = error.response.data.msg;
      if (
        error.response.data.existingTitles &&
        error.response.data.existingTitles.length > 0
      ) {
        const existingTitles = error.response.data.existingTitles.join(", ");
        const finalMessage = `${successMessage}`;
        toast.error(finalMessage);
      }
    }
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
  const filteredDataByModalEntries = userData?.filter((item) =>
    item.titleEnglish
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
  const filteredEntries = filteredDataByModalEntries?.filter((item) => {
    if (filterType === "Occasional") {
      return item.entryType === "Occasional";
    } else if (filterType === "Regular") {
      return item.entryType === "Regular";
    }
    return true;
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
        title: "Are you sure you want to add these Entries?",
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
        setOpen(false);
        setLoadingPermissionBySociety(true);
        try {
          addEntryByDropDown(entriesToAdd);

          setTimeout(() => {
            setValue(null);
            setInputValue("");
          }, 1300);
          getEntriesBySociety();
          setOpen(false);
          setSelectedEntries([]);
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
    <div>
      <Layout>
        <div className="container-fluid py-4 ">
          <div className="row">
            {(role_level === 1 || role_level === 2) && (
              <div className="col-12  ">
                <div className="card mb-4">
                  <div className="card-header pb-0">
                    <div className="filtered-div">
                      <div className="p-export-btn export-dropdown">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                          >
                            <TiExport className="export_icon" />
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="export-btns">
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToExcel(filteredData, "Entries")
                                }
                              >
                                Excel
                              </button>
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToCSV(filteredData, "Entries ")
                                }
                              >
                                CSV
                              </button>
                              <button
                                className="export_btn_data"
                                onClick={handleImportExportFunctionality}
                              >
                                Import
                              </button>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div>
                        {permissions[2]?.actions.create ? (
                          <div className="add-item-button_purpose">
                            <button
                              className="add-item-button"
                              onClick={handleAddEntry}
                            >
                              {language === "hindi" ? "Add +" : " + जोड़ें"}
                            </button>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </div>
                      <div className="search-filter-box">
                        <Box
                          sx={{
                            "& > :not(style)": { m: 1, width: "25ch" },
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
                          />
                        </Box>
                      </div>
                    </div>
                  </div>

                  <div className="card-body px-0 pt-0 pb-2 w-100 ">
                    <div className="table-responsive p-0 bg-black">
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
                      ) : permissions[2]?.actions.read ? (
                        <table className="table align-items-center mb-0  ">
                          <thead>
                            <tr>
                              <th className="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? " Entry Logo"
                                  : "  प्रवेश लोगो"}
                              </th>
                              <th className="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? " Entry" : "प्रवेश"}
                              </th>

                              <th className="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "   Date" : "तारीख"}
                              </th>
                              <th className="text-dark   text-center text-sm font-weight-bolder opacity-7 ps-2">
                                {language === "hindi" ? "Type" : "  प्रकार"}
                              </th>
                              <th className="text-center  text-center text-dark  text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "Actions" : "कार्रवाई"}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentPageData.length > 0 ? (
                              currentPageData.map((item, index) => (
                                <tr key={index}>
                                  <td className=" text-center align-middle ">
                                    {item.icon && item.icon.length > 0 ? (
                                      item.icon && (
                                        <div className="align-middle text-center">
                                          <img
                                            src={`/${item.icon.replace(
                                              "public/",
                                              ""
                                            )}`}
                                            alt=""
                                            className="purpose_image_icon"
                                          />
                                        </div>
                                      )
                                    ) : (
                                      <>
                                        {(() => {
                                          let words;

                                          words = item.titleEnglish.split(" ");

                                          const initials = words[0]
                                            .substring(0, 1)
                                            .toUpperCase();

                                          return (
                                            <>
                                              <div className="align-middle text-center purpose_icon_title">
                                                <h5 className="initialss ">
                                                  {initials}
                                                </h5>
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.titleEnglish}
                                  </td>

                                  <td className="align-middle text-center">
                                 { formatDate(item.joiningDate)}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.entryType}
                                  </td>
                                  <td className="actions align-middle text-center">
                                    {permissions[2]?.actions.edit ? (
                                      <button
                                        className="edit-btn"
                                        onClick={() =>
                                          handleId(item.created_by_edit)
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

                                    {permissions[2]?.actions.delete ? (
                                      <button
                                        className="dlt-btn"
                                        onClick={() => handleDelete(item._id)}
                                      >
                                        <MdDelete
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
              <div className="col-12  ">
                <div className="card mb-4">
                  <div className="card-header pb-0">
                    <div className="filtered-div">
                      <div className="p-export-btn export-dropdown">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                          >
                            <TiExport className="export_icon" />
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="export-btns">
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToExcel(
                                    filteredDataBySoceity,
                                    "Entries"
                                  )
                                }
                              >
                                Excel
                              </button>
                              <button
                                className="export_btn_data"
                                onClick={() =>
                                  exportToCSV(filteredDataBySoceity, "Entries ")
                                }
                              >
                                CSV
                              </button>
                              {role_level === 1 && (
                                <button
                                  className="export_btn_data"
                                  onClick={handleImportExportFunctionality}
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
                            "& > :not(style)": { m: 1, width: "25ch" },
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
                          />
                        </Box>
                      </div>
                      <>
                        <div>
                          <div>
                            {permissions[2]?.actions.create ? (
                              <div className="add-item-button_purpose">
                                <button
                                  className="add-item-button"
                                  onClick={handleClickOpen}
                                >
                                  {language === "hindi" ? "Add +" : " + जोड़ें"}
                                </button>
                              </div>
                            ) : (
                              <p></p>
                            )}
                          </div>
                          <Dialog
                            className="details-dialog"
                            onClose={handleClose}
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
                                ? "एंट्रीज़ जोड़ें"
                                : "  Add Entries"}
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
                                        as="div"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <label className="label_modal">
                                          <input
                                            className="ci_filter"
                                            type="radio"
                                            checked={
                                              filterType === "Occasional"
                                            }
                                            onChange={() =>
                                              handleFilterChange("Occasional")
                                            }
                                          />{" "}
                                          &nbsp;
                                          {language === "english"
                                            ? " अवसरिक"
                                            : "Occasional"}
                                        </label>
                                      </Dropdown.Item>

                                      <Dropdown.Item
                                        as="div"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <label className="label_modal">
                                          <input
                                            className="ci_filter"
                                            type="radio"
                                            checked={filterType === "Regular"}
                                            onChange={() =>
                                              handleFilterChange("Regular")
                                            }
                                          />
                                          &nbsp;&nbsp;
                                          {language === "english"
                                            ? " साप्ताहिक"
                                            : "Regular"}
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
                                              {item.icon ? (
                                                <img
                                                  src={`/${item.icon.replace(
                                                    "public/",
                                                    ""
                                                  )}`}
                                                  alt=""
                                                />
                                              ) : (
                                                <div className="modal-placeholder">
                                                  <div className="modal-image-div">
                                                    <b className="modal-word">
                                                      {item.titleEnglish
                                                        ?.charAt(0)
                                                        .toUpperCase() || ""}
                                                    </b>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <b className="modal-name">
                                              {item.titleEnglish}
                                            </b>
                                          </div>
                                        </>
                                      );
                                    })
                                  ) : (
                                    <div className="no-data-modal ">
                                      No Data
                                    </div>
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

                  <div className="card-body px-0 pt-0 pb-2 w-100 ">
                    <div className="table-responsive p-0 bg-black">
                      {loadingPermissionBySociety ? (
                        <>
                          {" "}
                          <div className="three_circle_loader">
                            <ThreeCircles
                              visible={true}
                              height={100}
                              width={100}
                              color="#5e72e4"
                              ariaLabel="three-circles-loading"
                            />
                          </div>
                        </>
                      ) : permissions[2]?.actions.read ? (
                        <table className="table align-items-center mb-0  ">
                          <thead>
                            <tr>
                              <th className="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi"
                                  ? " Entry Logo"
                                  : "  प्रवेश लोगो"}
                              </th>
                              <th className="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? " Entry" : "प्रवेश"}
                              </th>
                              <th className="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "   Date" : "तारीख"}
                              </th>
                              <th className="text-dark   text-center text-sm font-weight-bolder opacity-7 ps-2">
                                {language === "hindi" ? "Type" : "  प्रकार"}
                              </th>
                              <th className="text-center  text-center text-dark  text-sm font-weight-bolder opacity-7">
                                {language === "hindi" ? "Actions" : "कार्रवाई"}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentPageDataBySociety.length > 0 ? (
                              currentPageDataBySociety.map((item, index) => (
                                <tr key={index}>
                                  <td className=" text-center align-middle ">
                                    {item.icon && item.icon.length > 0 ? (
                                      item.icon && (
                                        <div className="align-middle text-center">
                                          <img
                                            src={`/${item.icon.replace(
                                              "public/",
                                              ""
                                            )}`}
                                            alt=""
                                            className="purpose_image_icon"
                                          />
                                        </div>
                                      )
                                    ) : (
                                      <>
                                        {(() => {
                                          let words;

                                          words = item.titleEnglish.split(" ");

                                          const initials = words[0]
                                            .substring(0, 1)
                                            .toUpperCase();

                                          return (
                                            <>
                                              <div className="align-middle text-center purpose_icon_title">
                                                <h5 className="initialss ">
                                                  {initials}
                                                </h5>
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.titleEnglish}
                                  </td>

                                  <td className="align-middle text-center">
                                  { formatDate(item.joiningDate)}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.entryType}
                                  </td>
                                  <td className="actions align-middle text-center">
                                    {/* <button
                                      className="edit-btn"
                                      onClick={() => handleId(item._id)}
                                      disabled={!permissions[2]?.actions.edit}
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
                                      className="dlt-btn"
                                      onClick={() =>
                                        handleDeleteBySociety(item._id)
                                      }
                                      disabled={!permissions[2]?.actions.delete}
                                    >
                                      <MdDelete
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
                                <td colSpan={5}>
                                  <div className="no_data_entry"> No data</div>
                                </td>
                              </tr>
                            )}
                            <td colSpan={5}>
                              {totalPagesBySoceity > 1 && (
                                <div className="table-pagination">
                                  <Stack spacing={2}>
                                    <Pagination
                                      count={totalPagesBySoceity}
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
    </div>
  );
}

export default EntryData;
