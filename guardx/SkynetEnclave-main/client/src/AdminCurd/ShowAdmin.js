import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminPannel/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { PORT } from "../Api/api";
import axios from "axios";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { ThreeCircles } from "react-loader-spinner";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";
import "./admin.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CommonNav from "../AdminSetting/CommonNav";
import Layout from "../lib/Layout";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import { TiExport } from "react-icons/ti";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
const ShowAdmin = () => {
  const { permissions } = useContext(PermissionContext);
  const { language } = useContext(LanguageContext);
  const [getUser, setGetUser] = useState([]);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatePage, setUpdatePage] = useState(false);
  const navigate = useNavigate();
  //handleAddAdmin
  const handleAddAdmin = () => {
    navigate("/admin/addUser");
  };
  //getSignUpUser
  const getSignUpUser = async () => {
    try {
      await axios.get(`${PORT}/getSignUpUser`).then(async (res) => {
        const response = await res.data.userData;
        const filterData = await response.filter(
          (item) => item.createdBy === getRoleId
        );
        setFilteredData(filterData.reverse());
        setGetUser(filterData);
        setTimeout(() => {
          setLoadingPermission(false);
        }, 800);

        setTotalPages(Math.ceil(filterData.length / perPage));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSignUpUser();
  }, []);

  //handleDelete
  const handleDelete = async (id) => {
    try {
      setUpdatePage((prevState) => !prevState);
      const result = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios
          .delete(`${PORT}/deleteUserWithSocietyUser/${id}`)
          .then((res) => {
            getSignUpUser();
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
            });
          });
        // getSignUpUser()
      }
    } catch (error) {
      console.error("Error deleting the user:", error);
      toast.error("Failed to delete the user.");
    }
  };
  //handleEdit
  const handleEdit = (id) => {
    navigate(`/admin/editUser/${id}`);
  };
  //setToggle Functionality
  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: pink[600],
      "&:hover": {
        backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: pink[600],
    },
  }));
  const label = { inputProps: { "aria-label": "Color switch demo" } };
  //handle toogle Functionlaity
  const handleActivationToggle = (index) => {
    const updatedUsers = getUser.map((user, i) => {
      if (i === index) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    });
    setGetUser(updatedUsers);
  };
  // Handle Search Functionality
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = getUser?.filter(
      (item) =>
        item.username?.includes(query.trim()) ||
        item.role?.includes(query.trim())
    );
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filteredData.length / perPage));
    setCurrentPage(1);
  };

  const [permissionData, setPermissionData] = useState([]);
  const getUserRole = JSON.parse(localStorage.getItem("userRole"));

  //Pagination functionality
  const perPage = 10;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, getUser.length);
  const currentPageData =
    filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : getUser.slice(startIndex, endIndex);
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };
  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(getUser);
      setTotalPages(Math.ceil(getUser.length / perPage));
    }
  }, [searchQuery, getUser, updatePage]);
  const handleImportExportFunctionality = () => {
    navigate("/admin/importUsers");
  };
  //handleApproveDeactivation
  const handleApproveDeactivation = async (userId) => {
    const data = {
      userId: userId,
      status: false,
    };
    try {
      const response = await axios.post(`${PORT}approveDeactivation`, data);
      console.log(response);
      getSignUpUser();
    } catch (error) {
      console.log(error);
    }
  };
  //handleRejectDeactivation
  const handleRejectDeactivation =async (userId) => {
    const data = {
      userId: userId,
      status: true,
    };
    try {
      const response = await axios.post(`${PORT}approveDeactivation`, data);
      console.log(response);
      getSignUpUser();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Layout>
        <div class="container-fluid ">
          <div class="row">
            <div class="col-12  ">
              <div class="card mb-4">
                <div class="card-header pb-0 user_import_search">
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
                            onClick={handleImportExportFunctionality}
                          >
                            Import
                          </button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  <div className="add-item-button_role">
                    {permissions[7]?.actions.create ? (
                      <button
                        className="add-item-button"
                        onClick={handleAddAdmin}
                      >
                        {language === "hindi" ? " Add +" : " + जोड़ें"}
                      </button>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <div>
                    <Box sx={{ "& > :not(style)": { m: 1, width: "30ch" } }}>
                      <TextField
                        id="search-input"
                        label={language === "hindi" ? "Search..." : " खोज..."}
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
                              color: "#5e72e4",
                            },
                          },
                        }}
                      />
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
                    ) : permissions[7]?.actions.read ? (
                      <table class="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th class="text-dark text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? " Useremail"
                                : " उपयोगकर्ताईमेल"}
                            </th>
                            <th class="text-dark text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Password" : " पासवर्ड"}
                            </th>
                            <th class="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Status" : "स्थिति"}
                            </th>
                            <th class="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? "Requested deactivation"
                                : "निष्क्रियता का अनुरोध"}
                            </th>
                            <th class="text-dark text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "   Role" : "भूमिका"}
                            </th>
                            <th class="text-dark text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "  Action" : "कार्रवाई"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredData.length > 0 ? (
                            currentPageData.map((item, index) => (
                              <tr key={index}>
                                <td className="align-middle text-center">
                                  {item.username}
                                </td>
                                <td className="align-middle text-center">
                                  {item.password}
                                </td>
                                <td className="align-middle text-center">
                                  <span
                                    style={{
                                      color: item.isActive ? "green" : "red",
                                    }}
                                  >
                                    {item.isActive ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="align-middle text-center">
                                  <span
                                    style={{
                                      color: item.requestedDeactivation
                                        ? "orange"
                                        : "green", // Adjusting colors as needed
                                    }}
                                  >
                                    {item.requestedDeactivation
                                      ? "Deactivation Requested"
                                      : "Active"}
                                  </span>
                                </td>
                                <td className="align-middle text-center">
                                  {item.role}
                                </td>
                                <td className="align-middle text-center ">
                                  {item.requestedDeactivation && (
                                    <>
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
                                            handleApproveDeactivation(item._id)
                                          }
                                        >
                                          <FaCheckCircle
                                            // style={{ color: "green" }}
                                            className="eyes_view"
                                          />
                                        </button>
                                      </Tooltip>
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
                                            handleRejectDeactivation(item._id)
                                          }
                                        >
                                          <FaTimesCircle
                                            // style={{ color: "red" }}
                                            className="eyes_view"
                                          />
                                        </button>
                                      </Tooltip>
                                    </>
                                  )}

                                  {permissions[7]?.actions.edit ? (
                                    <Tooltip
                                      title={
                                        language === "hindi"
                                          ? "Click to Edit"
                                          : "संपादित करें"
                                      }
                                      placement="top"
                                      arrow
                                    >
                                      <button className="edit-btn">
                                        <MdOutlineModeEdit
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title={
                                            language === "hindi"
                                              ? "Click to Edit"
                                              : "संपादित करें"
                                          }
                                          onClick={() => handleEdit(item._id)}
                                        />
                                      </button>
                                    </Tooltip>
                                  ) : (
                                    <p></p>
                                  )}
                                  {permissions[7]?.actions.delete ? (
                                    <Tooltip
                                      title={
                                        language === "hindi"
                                          ? "Click to Delete"
                                          : "हटाएं"
                                      }
                                      placement="top"
                                      arrow
                                    >
                                      <button className="dlt-btn">
                                        <MdDelete
                                          data-placement="top"
                                          title={
                                            language === "hindi"
                                              ? "Click to Delete"
                                              : "हटाएं"
                                          }
                                          onClick={() => handleDelete(item._id)}
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
    </>
  );
};

export default ShowAdmin;
