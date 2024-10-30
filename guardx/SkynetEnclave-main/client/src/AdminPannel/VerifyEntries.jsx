import AdminNavbar from "./AdminNavbar";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { PORT } from "../Api/api";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import "./verifyentry.css";
import "./request.css";
import Webcam from "react-webcam";
import { useRef } from "react";
import { useCallback } from "react";
import userPhoto from "./Images/avatar-1577909_1280.webp";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import "./maid.css";
import RegularUsersImages from "./RegularUserImages";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { TiExport } from "react-icons/ti";
import Papa from "papaparse";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ThreeCircles } from "react-loader-spinner";
import TextField from "@mui/material/TextField";
import { MdOutlineModeEdit } from "react-icons/md";
import CommonNav from "../AdminSetting/CommonNav";
import { RotatingLines } from "react-loader-spinner";
import Layout from "../lib/Layout";
import { PermissionContext } from "../lib/PermissionContext";
import { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
import { IoEyeSharp } from "react-icons/io5";
import { IoMdFingerPrint } from "react-icons/io";

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
const VerifyEntries = () => {
  const { permissions } = useContext(PermissionContext);
  const { language } = useContext(LanguageContext);
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
  const subRoleId = JSON.parse(localStorage.getItem("societyLogo"));
  const getSubRoleId = subRoleId._id || "";
  const subRoleIdBySociety = subRoleId.createdBy || "";
  const id = localStorage.getItem("maidId");
  const paramsid = useParams();
  const perPage = 10;
  const getMaid = async () => {
    try {
      const response = await axios.get(`${PORT}/getVerifieUser/${paramsid.id}`);
      setMaidName(response?.data?.verifyHouseMaid.reverse());
      const totalItems = response?.data.verifyHouseMaid.length;
      setTotalPages(Math.ceil(totalItems / perPage));
      setTimeout(() => {
        setLoadingPermission(false);
      }, 800);
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
    setImageBlobObject((updatedImageBlobObject) => {
      const imageBlobArray = updatedImageBlobObject.map(
        (item) => item.imageBlob
      );
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
        Swal.fire({
          title: "Deleted!",
          text: "Regular Entry has been deleted.",
          icon: "success",
        });
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
      const responseData = response.data.data;
      setloadingPermissionHeading(false);
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
    setSearchQuery(e.target.value);
    const quary = e.target.value;
    const tempMaidName = maidName;
    const filteredData = tempMaidName.filter(
      (item) =>
        item.houseMaidEnglish.includes(quary) ||
        item.aadharNumber.includes(quary)
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
    FileSaver.saveAs(blob, `${filename} ${dateTime}.csv`);
  };



  const idregular = paramsid.id;
  const handleAddRegularEntries = () => {
    navigate(`/admin/add-regular/${idregular}`);
  };
  const [loadingPermissionHeading, setloadingPermissionHeading] =
    useState(true);
  const getUserRole = JSON.parse(localStorage.getItem("userRole"));
  const handleImportFunctionality = () => {
    navigate("/admin/importRegularList");
    localStorage.setItem("paramsid",paramsid.id);
  };
  return (
    <div>
      <Layout>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                {loadingPermissionHeading ? (
                  <div className="loading_regular_div"></div>
                ) : (
                  <div className="">
                    {data.map((item, index) => (
                      <div className="main-header-verify" key={index}>
                        {item.entryType === "Regular" &&
                        item._id === paramsid.id ? (
                          <>
                            <div className="card-header mt--5 pb-0">
                              <h5>
                                {language === "hindi" ? " List of" : "  सूची"}
                                {"        "}
                                {item.titleEnglish}
                              </h5>
                            </div>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                <div className="row">
                  <div className="col-12 main_heading_nav_table">
                    <div className="add_And_export_btn">
                      <div className="ms-4">
                        {data.map((item, index) => (
                          <div className="">
                            {item.entryType === "Regular" &&
                            item._id == paramsid.id ? (
                              <>
                    
                                  <div className="p-export-btn ms-3  export-dropdown">
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
                                      <AccordionDetails className="regular-accordion-details">
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
                                            <button
                                              className="export_btn_data"
                                              onClick={
                                                handleImportFunctionality
                                              }
                                            >
                                              Import
                                            </button>
                                          </div>
                                        </Typography>
                                      </AccordionDetails>
                                    </Accordion>
                                  </div>
                              
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="ms-4">
                        {permissions[0]?.actions.create ? (
                          <div className="add-item-button_purpose">
                            <button
                              className="add-item-button"
                              onClick={handleAddRegularEntries}
                            >
                              {language === "hindi" ? "  Add+" : "  जोड़ें+"}
                            </button>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                    <div className="search_filter_all">
                      <Box
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: " #5e72e4",
                              borderWidth: "1px",
                              borderRadius: "5px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#5e72e4",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#5e72e4",
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
                            language === "hindi" ? "Search ...." : "खोज ...."
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
                <br />
                <div className="card-body px-0  pt-0 pb-2">
                  <div className="table-responsive p-0">
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
                    ) : permissions[0]?.actions.read ? (
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7 z-3">
                              {language === "hindi" ? " Names" : "  नाम"}
                            </th>
                            <th className=" text-center  text-dark text-sm font-weight-bolder opacity-7 ps-2">
                              {language === "hindi" ? " Gender" : "लिंग"}
                            </th>
                            <th className="text-center  text-dark text-sm font-weight-bolder opacity-7">
                              {language === "hindi"
                                ? " Aadhaar No."
                                : "  आधार नंबर"}
                            </th>

                            <th className="text-center   text-dark text-sm font-weight-bolder opacity-7">
                              {language === "hindi" ? " Action" : "  कार्यवाही"}
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

                                <td className="align-middle text-center  d-flex justify-content-center">
                                  <h6 className="regular_Details_view  attendanve_view">
                                    <IoMdFingerPrint
                                      onClick={() => handleAttendance(item._id)}
                                      data-toggle="tooltip"
                                      className="eyes_view"
                                      data-placement="top"
                                      title={
                                        language === "hindi"
                                          ? "Attendance view"
                                          : "उपस्थिति देखें"
                                      }
                                    />
                                  </h6>

                                  <RegularUsersImages item={item} />
                                  {permissions[0]?.actions.edit ? (
                                    <button
                                      className="edit-btn"
                                      onClick={handleOpen}
                                    >
                                      <MdOutlineModeEdit
                                        data-toggle="tooltip"
                                        className="eyes_view"
                                        data-placement="top"
                                        title={
                                          language === "hindi"
                                            ? "Click to Edit"
                                            : "संपादित करें"
                                        }
                                        onClick={() => handleMaidId(item._id)}
                                      />
                                    </button>
                                  ) : (
                                    <></>
                                  )}

                                  {permissions[0]?.actions.delete ? (
                                    <button
                                      onClick={() => handleDelete(item._id)}
                                      className="dlt-btn"
                                    >
                                      <MdDelete
                                        data-toggle="tooltip"
                                        className="eyes_view"
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
      </Layout>
    </div>
  );
};

export default VerifyEntries;
