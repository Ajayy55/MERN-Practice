import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminPannel/AdminNavbar";
import "./role.css";
import { PORT } from "../Api/api";
import axios from "axios";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThreeCircles } from "react-loader-spinner";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CommonNav from "../AdminSetting/CommonNav";
import Layout from "../lib/Layout";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
const ShowRoles = () => {
  const { language } = useContext(LanguageContext);
  const { permissions } = useContext(PermissionContext);
  const [showRolesUser, getShowRolesUser] = useState([]);
  const navigate = useNavigate();
  //getShow Roles
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const getShowRoles = async () => {
    let response = await axios.get(`${PORT}/roleGet`);
    const res = response.data.roles;
    const filterData = res.filter(
      (item) =>
        item.createdBy === getRoleId && item.defaultPermissionLevel !== 1
    );
    setUserData(filterData.reverse());
    setFilteredData(filterData);
    setTimeout(() => {
      setLoadingPermission(false);
    }, 800);
    getShowRolesUser(filterData);
  };
  useEffect(() => {
    getShowRoles();
  }, []);
  const handleAddRoles = () => {
    navigate("/admin/addRoles");
  };
  // handleDelete Role
  const handleDelete = async (id) => {
    console.log(id);
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your role has been deleted.",
            icon: "success",
          });
          await axios.delete(`${PORT}deleteRole/${id}`).then((res) => {
            toast.success(res.data.msg);
            getShowRoles();
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  // handleEdit Role
  const handleEdit = async (id) => {
    navigate(`/admin/editRoles/${id}`);
  };
  const [permissionData, setPermissionData] = useState([]);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const getUserRole = JSON.parse(localStorage.getItem("userRole"));
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const perPage = 10;
  useEffect(() => {
    let tempData = userData;

    if (searchQuery) {
      tempData = tempData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(tempData);
    setTotalPages(Math.ceil(tempData.length / perPage));
  }, [userData, searchQuery]);
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);
  return (
    <>
      <Layout>
        <div class="container-fluid  ">
          <div class="row">
            <div class="col-12  ">
              <div class="card mb-4">
                <div class="card-header d-flex pb-0">
                  <div className="add-item-button_role">
                    <div>
                      {permissions[5]?.actions.create ? (
                        <button
                          className="add-item-button"
                          onClick={handleAddRoles}
                        >
                          {language === "hindi" ? "  Add +" : " + जोड़ें "}
                        </button>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div className="">
                      <Box
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                      >
                        <TextField
                          id="search-input"
                          label={
                            language === "hindi" ? "Search..." : " खोज... "
                          }
                          variant="outlined"
                          value={searchQuery}
                          onChange={handleSearchInput}
                          className="search-input"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: " #5e72e4", // Default border color
                                borderWidth: "1px", // Default border width
                                borderRadius: "5px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#5e72e4", // Border color on hover
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#5e72e4", // Border color on focus
                              },

                              "& .MuiInputLabel-root.Mui-error": {
                                color: "#5e72e4", // Label color when error
                              },
                            },
                          }}
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
                    ) : permissions[5] && permissions[5]?.actions.read ? (
                      <table class="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th class="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? " Title" : " शीर्षक"}
                            </th>
                            <th class="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "  Description" : "विवरण"}
                            </th>
                            <th class="text-dark   text-center  text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? "Action" : "कार्रवाई "}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredData.length > 0 ? (
                            currentPageData.map((item, index) => {
                              return (
                                <>
                                  <tr>
                                    <td className="align-middle text-center">
                                      {item?.title}
                                    </td>
                                    <td className="align-middle text-center">
                                      {item?.desc}
                                    </td>
                                    <td className="align-middle text-center">
                                      {permissions[5]?.actions.edit ? (
                                        <button className="edit-btn">
                                          <MdOutlineModeEdit
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={
                                              language === "hindi"
                                                ? "Click to Edit"
                                                : "संपादित करें"
                                            }
                                            onClick={() => {
                                              handleEdit(item._id);
                                            }}
                                          />
                                        </button>
                                      ) : (
                                        <p></p>
                                      )}
                                      {permissions[5]?.actions.delete ? (
                                        <button className="dlt-btn">
                                          <MdDelete
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={
                                              language === "hindi"
                                                ? "Click to Delete"
                                                : "हटाएं"
                                            }
                                            onClick={() => {
                                              handleDelete(item._id);
                                            }}
                                          />
                                        </button>
                                      ) : (
                                        <p></p>
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={3}>
                                <div className="no_data_entry">No data</div>
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
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ShowRoles;
