import AdminNavbar from "./AdminPannel/AdminNavbar";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { PORT } from "./Api/api";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import "../src/AdminPannel/verifyentry.css";
import "../src/AdminPannel/request.css";
import Webcam from "react-webcam";
import { useRef } from "react";
import { useCallback } from "react";
import userPhoto from "../src/PhotoVerify/Images/avatar-1577909_1280.webp";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import "../src/AdminPannel/maid.css";
import RegularUsersImages from "../src/AdminPannel/RegularUserImages";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Papa from "papaparse"; // Importing papaparse for CSV export
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ThreeCircles } from "react-loader-spinner";
import TextField from "@mui/material/TextField";
import { MdOutlineModeEdit } from "react-icons/md";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
const Layout = () => {
  const [open, setOpen] = useState(false);
  const [clickValue, setClickValue] = useState("Click a Photo");
  const [clickValueAdhar, setClickValueAdhar] = useState(false);
  const [maidName, setMaidName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(userPhoto);
  const [imageStore, setImageStore] = useState([]);
  const [imageBlobObject, setImageBlobObject] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  // const subRoleId = JSON.parse(localStorage.getItem("societyLogo"));
  // const getSubRoleId = subRoleId._id ||null;
  // const subRoleIdBySociety = subRoleId.createdBy ||null;
  const id = localStorage.getItem("maidId");
  const paramsid = useParams();
  const perPage = 10;
  const getMaid = async () => {
    try {
      const response = await axios.get(`${PORT}/getVerifieUser/${paramsid.id}`);
      // Update state with sorted data
      setMaidName(response?.data?.verifyHouseMaid.reverse());
      // setMaidName(response?.data?.verifyHouseMaid);
      const totalItems = await response?.data.verifyHouseMaid.length;
      setTotalPages(Math.ceil(totalItems / perPage));

      // setLoadingPermission(false)
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMaid();
  }, []);

  const formik = useFormik({
    initialValues: {
      houseMaidHindi: "",
      houseMaidEnglish: "",
      gender: "",
      address: "",
      aadharNumber: "",
      paramsId: paramsid.id,
      image: [],
    },
    validationSchema: Yup.object().shape({
      houseMaidHindi: Yup.string().required(" Name in Hindi is required"),
      houseMaidEnglish: Yup.string().required(" Name in English is required"),
      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      aadharNumber: Yup.string()
        .matches(/^[0-9]*$/, "Only numbers are allowed")
        .required("Aadhaar Number is required"),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      const result = await Swal.fire({
        title: "Are you sure you want to Add this Entery?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add it!",
        customClass: {
          container: "my-swal",
        },
      });

      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          for (let key in values) {
            if (key !== "image") {
              formData.append(key, values[key]);
            }
          }
          values.image.forEach((imageBlob, index) => {
            formData.append("image", imageBlob);
          });
          const response = await axios.post(`${PORT}/verifieduser`, formData);
          // console.log("Response:", response.data);
          formik.resetForm();

          setImgSrc(null);
          handleClose();
          getMaid();
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }
    },
  });

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const imageBlob = await fetchImageBlob(imageSrc);

    setImageBlobObject((prevImageUrls) => [...prevImageUrls, { imageBlob }]);

    const url = URL.createObjectURL(imageBlob);
    setImgSrc(url);
    setImageStore((prevImageUrls) => [...prevImageUrls, { url }]);

    // Use callback function to access updated state value
    setImageBlobObject((updatedImageBlobObject) => {
      const imageBlobArray = updatedImageBlobObject.map(
        (item) => item.imageBlob
      );
      // console.log("Image Blob Array", imageBlobArray);
      formik.setFieldValue("image", imageBlobArray);
      return updatedImageBlobObject;
    });
  }, [webcamRef, formik]);

  const fetchImageBlob = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching image blob:", error);
      return null;
    }
  };

  const retake = () => {
    setImgSrc(null);
    setClickValueAdhar(true);
    setClickValue("Capture Photo");
  };
  // console.log("Image",imgSrc)
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

    if (result.isConfirmed) {
      try {
        await axios.delete(`${PORT}/delHouseMaid/${id}`);

        setMaidName(maidName.filter((item) => item._id !== id));
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error");
    }
  };
  const handleMaidId = (id) => {
    localStorage.setItem("maidId", id);
    navigate(`/admin/edit-regular/${id}`);
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, maidName.length);
  const currentPageData =
    filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : maidName.slice(startIndex, endIndex);
  // console.log("jnkhcfg", currentPageData);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setImgSrc(userPhoto);
    setClickValueAdhar(false);
    setImageStore([]);
    setImageBlobObject([]);
  };
  const [data, setData] = useState([]);
  const getEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const responseData = await response.data.data;
      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEntries();
  }, []);
  const navigate = useNavigate();
  const handleAttendance = (item) => {
    navigate(`/admin/attendance/${item}`);
  };
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    const quary = e.target.value.toLowerCase();
    const tempMaidName = maidName;
    const filteredData = tempMaidName.filter(
      (item) =>
        item.houseMaidEnglish.toLowerCase().includes(quary) ||
        item.aadharNumber.toLowerCase().includes(quary)
    );
    setFilteredData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
    setCurrentPage(1);
  };
  useEffect(() => {
    setFilteredData(maidName);
  }, [maidName]);
  useEffect(() => {
    if (!searchQuery) {
      getMaid();
      setTotalPages(Math.ceil(maidName.length / perPage));
    }
  }, [searchQuery, perPage, currentPage, paramsid]);

  const exportToExcel = (data, filename) => {
    const filteredData = data.map(
      ({ houseMaidEnglish, gender, aadharNumber }) => ({
        Name: houseMaidEnglish,
        Gender: gender,
        "Aadhar Number": aadharNumber,
      })
    );

    const ws = XLSX.utils.json_to_sheet(filteredData);

    const wscols = [{ wch: 20 }, { wch: 15 }, { wch: 20 }];
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
    const filteredData = data?.map(
      ({ houseMaidEnglish, gender, aadharNumber }) => ({
        Name: houseMaidEnglish,
        Gender: gender,
        AadharNumber: aadharNumber.match(/.{1,4}/g).join("-"),
      })
    );

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentTimeAndDate = new Date();
    const dateTime = `${currentTimeAndDate} `;
    FileSaver.saveAs(blob, `${filename}${dateTime}.csv`);
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
        setTotalPages(Math.ceil((data.length + importedData.length) / perPage));
      },
      error: (error) => {
        console.error("Error importing CSV:", error);
      },
    });
  };

  const idregular = paramsid.id;
  const handleAddRegularEntries = () => {
    navigate(`/admin/add-regular/${idregular}`);
  };
  const [permissionData, setPermissionData] = useState([]);
  const getUserRole = JSON.parse(localStorage.getItem("userRole"));
  //Permission Check
  useEffect(() => {
    const getRoleData = async () => {
      try {
        let response = await axios.get(`${PORT}/roleGet`);
        const filteredRoles = await response.data.roles.filter(
          (item) => item.title === getUserRole
        );
        setPermissionData(filteredRoles[0]?.permissions);
        setTimeout(() => {
          setLoadingPermission(false);
        }, 2000);
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };
    getRoleData();
  }, []);

  const permissionCheck =
    Array.isArray(permissionData[0]?.actions) &&
    (permissionData[0].actions.includes("edit") ||
      permissionData[0].actions.includes("delete") ||
      permissionData[0].actions.includes("create") ||
      permissionData[0].actions.includes("read"));
  const permissions = {};
  if (permissionData[0] === null || permissionCheck) {
    if (permissionData[0]?.actions.includes("edit")) {
      permissions["edit"] = {
        index: permissionData[0]?.actions.indexOf("edit"),
        value: true,
      };
    } else {
      permissions["edit"] = { index: -1, value: false }; // -1 signifies not present
    }

    if (permissionData[0]?.actions.includes("delete")) {
      permissions["delete"] = {
        index: permissionData[0]?.actions.indexOf("delete"),
        value: true,
      };
    } else {
      permissions["delete"] = { index: -1, value: false };
    }

    if (permissionData[0]?.actions.includes("create")) {
      permissions["create"] = {
        index: permissionData[0]?.actions.indexOf("create"),
        value: true,
      };
    } else {
      permissions["create"] = { index: -1, value: false };
    }

    if (permissionData[0]?.actions.includes("read")) {
      permissions["read"] = {
        index: permissionData[0]?.actions.indexOf("read"),
        value: true,
      };
    } else {
      permissions["read"] = { index: -1, value: false };
    }
  }
  return (
    <>
      <body className="g-sidenav-show   bg-gray-100">
        <div className="min-height-300 bg-primary position-absolute w-100"></div>
        <AdminNavbar />
        <main className="main-content position-relative border-radius-lg ">
          {/* <!-- Navbar --> */}
          <nav
            className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl "
            id="navbarBlur"
            data-scroll="false"
          >
            <div className="container-fluid py-1 px-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                  <li
                    className="breadcrumb-item text-sm text-white active"
                    aria-current="page"
                  >
                    Regular Entries
                  </li>
                </ol>
                <h6 className="font-weight-bolder text-white mb-0">
                  Regular Entries
                </h6>
              </nav>
              <div
                className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                id="navbar"
              >
                <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                  <div className="input-group">
                    <span className="input-group-text text-body">
                      <i className="fas fa-search" aria-hidden="true"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type here..."
                    />
                  </div>
                </div>

                <ul className="navbar-nav  justify-content-end">
                  <li className="nav-item d-flex align-items-center">
                    <a
                      href="javascript:;"
                      className="nav-link text-white font-weight-bold px-0"
                    >
                      <i className="fa fa-user me-sm-1"></i>
                      <span className="d-sm-inline d-none">Sign In</span>
                    </a>
                  </li>
                  <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                    <a
                      href="javascript:;"
                      className="nav-link text-white p-0"
                      id="iconNavbarSidenav"
                    >
                      <div className="sidenav-toggler-inner">
                        <i className="sidenav-toggler-line bg-white"></i>
                        <i className="sidenav-toggler-line bg-white"></i>
                        <i className="sidenav-toggler-line bg-white"></i>
                      </div>
                    </a>
                  </li>
                  <li className="nav-item px-3 d-flex align-items-center">
                    <a href="javascript:;" className="nav-link text-white p-0">
                      <i className="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
                    </a>
                  </li>
                  <li className="nav-item dropdown pe-2 d-flex align-items-center">
                    <a
                      href="javascript:;"
                      className="nav-link text-white p-0"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-bell cursor-pointer"></i>
                    </a>
                    <ul
                      className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li className="mb-2">
                        <a
                          className="dropdown-item border-radius-md"
                          href="javascript:;"
                        >
                          <div className="d-flex py-1">
                            <div className="my-auto">
                              <img
                                src="../assets/img/team-2.jpg"
                                className="avatar avatar-sm  me-3 "
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="text-sm font-weight-normal mb-1">
                                <span className="font-weight-bold">
                                  New message
                                </span>{" "}
                                from Laur
                              </h6>
                              <p className="text-xs text-secondary mb-0">
                                <i className="fa fa-clock me-1"></i>
                                13 minutes ago
                              </p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li className="mb-2">
                        <a
                          className="dropdown-item border-radius-md"
                          href="javascript:;"
                        >
                          <div className="d-flex py-1">
                            <div className="my-auto">
                              <img
                                src="../assets/img/small-logos/logo-spotify.svg"
                                className="avatar avatar-sm bg-gradient-dark  me-3 "
                              />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="text-sm font-weight-normal mb-1">
                                <span className="font-weight-bold">
                                  New album
                                </span>{" "}
                                by Travis Scott
                              </h6>
                              <p className="text-xs text-secondary mb-0">
                                <i className="fa fa-clock me-1"></i>1 day
                              </p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item border-radius-md"
                          href="javascript:;"
                        >
                          <div className="d-flex py-1">
                            <div className="avatar avatar-sm bg-gradient-secondary  me-3  my-auto">
                              {/* <svg width="12px" height="12px" viewBox="0 0 43 36" 
                    version="1.1" xmlns="http://www.w3.org/2000/svg" 
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>credit-card</title>
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g transform="translate(-2169.000000, -745.000000)" fill="#FFFFFF" fill-rule="nonzero">
                          <g transform="translate(1716.000000, 291.000000)">
                            <g transform="translate(453.000000, 454.000000)">
                              <path className="color-background" d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z" opacity="0.593633743"></path>
                              <path className="color-background" d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg> */}
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <h6 className="text-sm font-weight-normal mb-1">
                                Payment successfully completed
                              </h6>
                              <p className="text-xs text-secondary mb-0">
                                <i className="fa fa-clock me-1"></i>2 days
                              </p>
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {/* <!-- End Navbar --> */}
          <div className="container-fluid py-4 mt-5">
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header pb-0">
                    {/* {data.map((item, index) => (
                      <div className="main-header-verify">
                        {item.entryType === "Regular" &&
                        item._id == paramsid.id ? (
                          <>
                            <div className="heading-admin-panel">
                              <h2>List of {item.titleEnglish}</h2>
                            </div>
                            <br />
                            <div className="filtered-div main-header-verify">
                              <div className="p-export-btn  export-dropdown">
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                  >
                                    <Typography>
                                      {" "}
                                      <TiExport className="export_icon" />{" "}
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
                                              item.titleEnglish
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
                                              item.titleEnglish
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
                              {permissions["create"] &&
                              permissions["create"].value ? (
                                <div className="add-item-button_main">
                                  <button
                                    className="add-item-button add_item_button_verifyentry"
                                    onClick={handleAddRegularEntries}
                                  >
                                    Add +
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
                                        borderColor: " #E11D48", // Default border color
                                        borderWidth: "1px", // Default border width
                                        borderRadius: "5px",
                                      },
                                      "&:hover fieldset": {
                                        borderColor: " #E11D48", // Border color on hover
                                      },
                                      "&.Mui-focused fieldset": {
                                        borderColor: " #E11D48", // Border color on focus
                                      },

                                      "& .MuiInputLabel-root.Mui-error": {
                                        color: "red", // Label color when error
                                      },
                                    },
                                  }}
                                >
                                  <TextField
                                    id="search-input"
                                    label="Search ...."
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    className="search-input"
                                  />
                                </Box>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))} */}
                    {/* <div className="btn_main_div">
              {data.map((item, index) => (
                <div className="main-header-verify">
                  {item.entryType === "Regular" && item._id == paramsid.id ? (
                    <>
                      <div className="heading-admin-panel">
                        <h2>List of {item.titleEnglish}</h2>
                      </div>
                      <br />
                      <div className="filtered-div main-header-verify">
                        <div className="p-export-btn  export-dropdown">
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ArrowDropDownIcon />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                            >
                              <Typography>
                                {" "}
                                <TiExport className="export_icon" />{" "}
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
                                        item.titleEnglish
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
                                        item.titleEnglish
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
                        {permissions["create"] &&
                        permissions["create"].value ? (
                          <div className="add-item-button_main">
                            <button
                              className="add-item-button add_item_button_verifyentry"
                              onClick={handleAddRegularEntries}
                            >
                              Add +
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
                                  borderColor: " #E11D48", // Default border color
                                  borderWidth: "1px", // Default border width
                                  borderRadius: "5px",
                                },
                                "&:hover fieldset": {
                                  borderColor: " #E11D48", // Border color on hover
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: " #E11D48", // Border color on focus
                                },

                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red", // Label color when error
                                },
                              },
                            }}
                          >
                            <TextField
                              id="search-input"
                              label="Search ...."
                              variant="outlined"
                              value={searchQuery}
                              onChange={handleSearchInput}
                              className="search-input"
                            />
                          </Box>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div> */}
                  </div>
                  {permissions["create"] && permissions["create"].value ? (
                    <div className="add-item-button_main">
                      <button
                        className="add-item-button add_item_button_verifyentry"
                        onClick={handleAddRegularEntries}
                      >
                        Add +
                      </button>
                    </div>
                  ) : (
                    <p></p>
                  )}
                  <div className="card-body px-0  pt-0 pb-2">
                    <div className="table-responsive p-0">
                      {loadingPermission ? (
                        <div className="three_circle_loader">
                          <ThreeCircles
                            visible={true}
                            height={100}
                            width={100}
                            color="#E11D48"
                            ariaLabel="three-circles-loading"
                          />
                        </div>
                      ) : permissions["read"] && permissions["read"].value ? (
                        <table className="table align-items-center mb-0">
                          <thead>
                            <tr>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Names
                              </th>
                              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                Gender
                              </th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Adhar No.
                              </th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Attendance
                              </th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Details
                              </th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredData.length > 0 ? (
                              currentPageData.map((item, index) => (
                                <tr key={index}>
                                  <td className="align-middle text-center">
                                    {item.houseMaidEnglish}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.gender}
                                  </td>
                                  <td className="align-middle text-center">
                                    {item.aadharNumber}
                                  </td>
                                  <td
                                    className="attendance-data"
                                    onClick={() => handleAttendance(item._id)}
                                  >
                                    view
                                  </td>
                                  <td className="align-middle text-center">
                                    <RegularUsersImages item={item} />
                                  </td>
                                  <td className="align-middle text-center">
                                    {permissions["edit"] &&
                                    permissions["edit"].value ? (
                                      <button
                                        className="edit-btn"
                                        onClick={handleOpen}
                                      >
                                        <MdOutlineModeEdit
                                          onClick={() => handleMaidId(item._id)}
                                        />
                                      </button>
                                    ) : (
                                      <p></p>
                                    )}

                                    {permissions["delete"] &&
                                    permissions["delete"].value ? (
                                      <button
                                        onClick={() => handleDelete(item._id)}
                                        className="dlt-btn"
                                      >
                                        <MdDelete />
                                      </button>
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
                          <h2> You do not have permission to read this data</h2>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </>
  );
};

export default Layout;
