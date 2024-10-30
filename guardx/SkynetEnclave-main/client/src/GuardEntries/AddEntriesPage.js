import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { IoEyeSharp } from "react-icons/io5";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { PORT } from "../Api/api";
import TextField from "@mui/material/TextField";
import "./addEntries.css";
import PropTypes from "prop-types";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { green } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import { ThreeCircles } from "react-loader-spinner";
import { DataContext } from "../lib/DataContext";
import { useContext } from "react";
import { IoFingerPrintOutline } from "react-icons/io5";
import Box from "@mui/material/Box";
import { MdErrorOutline } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { GoArrowDownLeft } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { RxCross2 } from "react-icons/rx";
import { LanguageContext } from "../lib/LanguageContext";
import { memo } from "react";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  zIndex: 133,
};
const AddEntriesPage = () => {
  const { language } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const [groupedData, setGroupedData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);
  const [loadingOccasionalEntries, setLoadingOccasionalEntries] =
    useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const guardId = JSON.parse(localStorage.getItem("guardId"));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${PORT}/getData`);
      const res = response.data.data;
      const filterDataAccSociety = res.filter(
        (item) => item.guardId === guardId
      );

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const grouped = filterDataAccSociety.reduce((acc, item) => {
        const [day, month, year] = item.submitedDate.split("-");
        const monthName = months[parseInt(month) - 1];
        const key = `${day}-${monthName}-${year}`;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(item);
        return acc;
      }, {});

      setGroupedData(grouped);
      const monthKeys = Object.keys(grouped).sort(
        (a, b) => new Date(b) - new Date(a)
      );
      const latestMonth = monthKeys[0];
      setLoadingOccasionalEntries(false);
      setSelectedMonth(latestMonth);
      setActiveMonth(latestMonth);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleMonthClick = (month) => {
    setActiveMonth(month);
    setSelectedMonth(month);
    setCurrentPageFirstTab(1);
  };
  //Pagination Logic For First Tab
  const ITEMS_PER_PAGE = 6;
  const [currentPageFirstTab, setCurrentPageFirstTab] = useState(1);
  const [totalPagesFirstTab, setTotalPagesFirstTab] = useState(1);
  const [currentDataForFirstTab, setCurrentDataForFirstTab] = useState([]);
  useEffect(() => {
    if (groupedData[activeMonth]) {
      const data = groupedData[activeMonth];
      // setTotalPagesFirstTab(Math.ceil(data.length / ITEMS_PER_PAGE));
      setCurrentDataForFirstTab(data);
      setCurrentPageFirstTab(1);
    } else {
      setTotalPagesFirstTab(0);
      setCurrentDataForFirstTab([]);
      setCurrentPageFirstTab(1);
    }
  }, [groupedData, activeMonth, startDate, endDate]);
  const handlePageChange = (event, value) => {
    setCurrentPageFirstTab(value);
    const data = groupedData[activeMonth];
    setCurrentDataForFirstTab(
      data.slice((value - 1) * ITEMS_PER_PAGE, value * ITEMS_PER_PAGE)
    );
  };
  const monthKeys = Object.keys(groupedData).sort();
  //Search Functionality for First Page
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredData = currentDataForFirstTab.filter((item) => {
    const [day, month, year] = item.submitedDate.split("-");
    const itemDate = new Date(`${year}-${month}-${day}`);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const isWithinDateRange =
      (!start || itemDate >= start) && (!end || itemDate <= end);
    const searchLower = searchQuery.toLowerCase();

    return (
      isWithinDateRange &&
      (item.entryType?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.purposeType?.toLowerCase().includes(searchLower))
    );
  });

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`action-tabpanel-${index}`}
        aria-labelledby={`action-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `action-tab-${index}`,
      "aria-controls": `action-tabpanel-${index}`,
    };
  }

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  const fabGreenStyle = {
    color: "common.white",
    bgcolor: green[500],
    "&:hover": {
      bgcolor: green[600],
    },
  };

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  //Regular Entries Logic
  const { data } = useContext(DataContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  //handle Clock Out
  const handleClockOut = async (id) => {
    try {
      const response = await axios.post(`${PORT}/nonverifyClockOut/${id}`);
      toast.success(response.data.message);
      fetchData();
    } catch (error) {}
  };
  useEffect(() => {
    handleClockOut();
  }, []);

  // RegularEntries
  //Get RegularEntries
  const society_id = JSON.parse(localStorage.getItem("society_id"));
  const [regularEntries, setRegularEntries] = useState([]);
  const [loadingRegular, setRegularLoading] = useState(true);
  const [monthsList, setMonthsList] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [valueRegular, setValueRegular] = useState(0);
  const [selectedEntryData, setSelectedEntryData] = useState([]);
  const [loadingRegularEntries, setLoadingRegularEntries] = useState(true);
  const ITEMS_PER_PAGE_SEC_TAB = 6;
  const [currentPageSecondTab, setCurrentPageSecondTab] = useState(1);
  const [totalPagesSecondTab, setTotalPagesSecondTab] = useState(1);
  const [currentDataForSecondTab, setCurrentDataForSecondTab] = useState([]);
  const [searchQuerySecTab, setSearchQuerySecTab] = useState("");

  useEffect(() => {
    if (selectedEntryData) {
      const totalItems = selectedEntryData.length;
      setTotalPagesSecondTab(Math.ceil(totalItems / ITEMS_PER_PAGE_SEC_TAB));
      setCurrentDataForSecondTab(
        selectedEntryData.slice(0, ITEMS_PER_PAGE_SEC_TAB)
      );
      setCurrentDataForSecondTab(selectedEntryData);
      setCurrentPageSecondTab(1);
    }
  }, [selectedEntryData]);
  const getRegularEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const allEntries = response.data.data;
      const filterData = allEntries
        .filter((item) => item._id)
        .map((item) => item._id);

      const getMaid = async () => {
        try {
          const response = await axios.get(`${PORT}/getAllVerifyHouseMaid`);
          const verifyHouseMaid = response.data.verifyHouseMaid;
          const verifiedIds = filterData.filter((id) =>
            verifyHouseMaid?.some((maid) => maid.paramsId === id)
          );
          const filteredUserRegularEntries = allEntries.filter((item) =>
            verifiedIds.includes(item._id)
          );
          const filterRegular = filteredUserRegularEntries.filter(
            (item) => item && item.society_id === society_id
          );

          const monthsYears = filterRegular.map((item) => {
            const [day, month, year] = item.joiningDate.split("-");
            return `${month}-${year}`;
          });
          setLoadingRegularEntries(false);
          const uniqueMonthsYears = [...new Set(monthsYears)];

          setMonthsList(uniqueMonthsYears);
          setRegularLoading(false);
          setRegularEntries(filterRegular);

          localStorage.setItem("regularEntries", JSON.stringify(filterRegular));
          if (uniqueMonthsYears.length > 0) {
            const latestMonthYear = uniqueMonthsYears.reduce((a, b) =>
              a > b ? a : b
            );
            setSelectedMonthYear(latestMonthYear);
          }
        } catch (error) {
          console.log(error);
        }
      };

      return getMaid();
    } catch (error) {
      console.log(error);
    }
  };
  const handleMonthClicks = (monthYear) => {
    setSelectedMonthYear(monthYear);
  };

  // Handle search input change
  const handleSearchChangeSecTab = (event) => {
    setSearchQuerySecTab(event.target.value);
  };

  // Filter data based on search query
  const filteredDataSecTab = currentDataForSecondTab.filter((item) => {
    const searchLower = searchQuerySecTab?.toLowerCase();

    return (
      item.houseMaidEnglish.toLowerCase().includes(searchLower) ||
      item.gender.toLowerCase().includes(searchLower) ||
      item.aadharNumber.toLowerCase().includes(searchLower) ||
      item.address.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    getRegularEntries();
  }, [society_id]);

  useEffect(() => {
    if (selectedMonthYear && regularEntries.length > 0) {
      const [month, year] = selectedMonthYear.split("-").map(Number);
      const filteredByMonthYear = regularEntries.filter((item) => {
        const [day, monthStr, yearStr] = item.joiningDate.split("-");
        return Number(monthStr) === month && Number(yearStr) === year;
      });
      setFilteredEntries(filteredByMonthYear);
    } else {
      setFilteredEntries(regularEntries);
    }
  }, [selectedMonthYear, regularEntries]);

  useEffect(() => {
    if (monthsList.length > 0) {
      const latestMonthYear = monthsList.reduce((a, b) => (a > b ? a : b));
      setValueRegular(monthsList.indexOf(latestMonthYear));
    }
  }, [monthsList, currentPageFirstTab]);
  useEffect(() => {
    getRegularEntries();
  }, [society_id]);
  useEffect(() => {
    if (regularEntries.length > 0) {
      const firstEntryId = regularEntries[0]._id;
      setValueRegular(0);
      handleGetIdRegularEntries(firstEntryId);
    }
  }, [regularEntries]);
  //RegularEntries Tabing
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }
  const handleChangeRegular = (event, newValue) => {
    setValueRegular(newValue);
    handleGetIdRegularEntries(filteredEntries[newValue]._id);
  };
  const handleGetIdRegularEntries = async (id) => {
    try {
      const response = await axios.get(`${PORT}/getVerifieUser/${id}`);
      setSelectedEntryData(response.data.verifyHouseMaid);
    } catch (error) {}
  };

  // Regular House Maid Attendance Show
  const [openRegularMaidView, setOpenRegularMaidView] = React.useState(false);

  const handleCloseRegularMaidView = () => setOpenRegularMaidView(false);
  const columns = [
    {
      id: "name",
      label: language === "english" ? "नाम" : "Name",
      minWidth: 170,
      align: "center",
    },
    {
      id: "code",
      label: language === "english" ? "तारीख" : "Date",
      minWidth: 100,
      align: "center",
    },
    {
      id: "population",
      label: language === "english" ? "कार्य आरंभ" : "Clock-In",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "size",
      label: language === "english" ? "कार्य समाप्ति" : "Clock-Out",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const columnsOccasionalEntries = [
    {
      id: "name",
      label: language === "hindi" ? "Name" : "नाम",
      minWidth: 170,
      align: "center",
    },
    {
      id: "code",
      label: language === "hindi" ? "Purpose" : "उद्देश्य",
      minWidth: 100,
      align: "center",
    },
    {
      id: "phone",
      label: language === "hindi" ? "Phone No." : "फोन नंबर",
      minWidth: 100,
      align: "center",
    },
    {
      id: "houseNumber",
      label: language === "hindi" ? "House no." : "मकान नंबर",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "owner",
      label: language === "hindi" ? "Owner" : "मालिक",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "images",
      label: language === "hindi" ? "Images" : "छवियाँ",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "clockIn",
      label: language === "hindi" ? "Clock-In" : "क्लॉक-इन",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "clockOut",
      label: language === "hindi" ? "Clock-Out" : "क्लॉक-आउट",
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];

  function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [rows, setRows] = useState([]);
  const [getAttendance, setGetAttendance] = useState([]);
  const handleOpenRegularMaidView = async (id) => {
    try {
      const result = await axios.get(`${PORT}/getMaidEntry`);

      const getResponse = result.data.data;
      const getAttendanceWithId = getResponse.filter(
        (item) => item.parentId === id
      );
      const getGuardEntry = getAttendanceWithId.filter(
        (item) => item.guardId === guardId
      );

      setGetAttendance(getGuardEntry.reverse());
    } catch (error) {
      console.log(error);
    }
    setOpenRegularMaidView(true);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const paginatedData = getAttendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  //get SocietyDetails
  const { societyDetails } = useContext(DataContext);

  //Occasional View
  const [openOccasionalView, setOpenOccasionalView] = React.useState(false);
  const [getParticularOccasionalEntry, setGetParticularOccasionalEntry] =
    useState([]);
  const [particularOccasionalEntryLoader, setParticularOccasionalEntryLoader] =
    useState(true);
  const handleOpenOccasionalView = async (id) => {
    setOpenOccasionalView(true);
    const response = await axios.get(`${PORT}/getData`);
    const res = response.data.data;
    const filterDataParticularOccasionalEntry = res.filter(
      (item) => item._id === id
    );
    setParticularOccasionalEntryLoader(false);
    setGetParticularOccasionalEntry(filterDataParticularOccasionalEntry);
  };
  const handleCloseOccasionalView = () => {
    setOpenOccasionalView(false);
  };
  const labelText = language === "english" ? "खोजें" : "Search...";

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  //Search Functionlaity for First Tab
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]);
  const SearchFilterForFirstTab = memo(() => (
    <div className="search_filter_guard_entry">
      <h5>
        <Box
          sx={{
            "& > :not(style)": { width: "30ch" },
          }}
        >
          <TextField
            id="search-input"
            label={labelText}
            variant="outlined"
            value={searchQuery}
            onInput={handleSearchChange}
            inputRef={inputRef}
          />
        </Box>
      </h5>
    </div>
  ));
  //SearchFunctionlaty for Second Tab
  const inputRefSec = useRef();
  useEffect(() => {
    if (inputRefSec.current) {
      inputRefSec.current.focus();
    }
  }, [searchQuerySecTab]);
  const SearchFilterForSecTab = memo(() => (
    <div className="search_filter_guard_entry">
      <h5>
        <Box
          sx={{
            "& > :not(style)": { width: "30ch" },
          }}
        >
          <TextField
            label={labelText}
            value={searchQuerySecTab}
            onInput={handleSearchChangeSecTab}
            inputRef={inputRefSec}
          />
        </Box>
      </h5>
    </div>
  ));
  //handle date and time filter functionality
  const [filteredDataForDateAndTime, setFilteredDataForDateAndTime] =
    useState(getAttendance);
  const handleDateFilter = (date) => {
    const formatDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    };
    const filtered = getAttendance.filter((item) => {
      const apiDateFormatted = formatDate(item.submittedDate);
      return date ? apiDateFormatted === date : true;
    });

    setFilteredDataForDateAndTime(filtered);
  };
  const handleDateClearFilter = () => {
    setFilteredDataForDateAndTime(paginatedData);
  };

  return (
    <div>
      <React.Fragment>
        <Tooltip
          title={language === "english" ? "उपस्थिति देखें" : "View Attendance"}
          placement="top"
          arrow
        >
          <button onClick={handleClickOpen} className="view_attendance_button">
            <IoFingerPrintOutline className="page_icon" />
          </button>
        </Tooltip>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <ToastContainer />
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {societyDetails ? societyDetails.name : <></>}
                {language === "english" ? " उपस्थिति" : " Attendance"}
              </Typography>
            </Toolbar>
          </AppBar>

          <Box sx={{ borderColor: "divider", width: "100%" }}>
            <Box sx={{ borderColor: "divider", width: "100%" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label={
                    language === "english"
                      ? " मेहमान प्रविष्टियाँ"
                      : "Guest Entries"
                  }
                  {...a11yProps(0)}
                  sx={{ flexGrow: 1, width: "100%" }}
                />
                <Tab
                  label={
                    language === "english"
                      ? "कर्मचारी उपस्थिति"
                      : "Staff Attendance"
                  }
                  {...a11yProps(1)}
                  sx={{ flexGrow: 1, width: "100%" }}
                />
              </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
              {loadingOccasionalEntries ? (
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
                <div className="main_attendance_page">
                  {selectedMonth ? (
                    <div
                      className="regular_month_list"
                      style={{ width: "100%" }}
                    >
                      <div className="regular_month_div">
                        <Carousel
                          className="carousel_width"
                          showArrows={true}
                          showThumbs={false}
                          infiniteLoop={true}
                          emulateTouch={true}
                          selectedItem={monthKeys.indexOf(activeMonth)}
                          onChange={(index) => setActiveMonth(monthKeys[index])}
                        >
                          {monthKeys.map((month, index) => (
                            <div key={index}>
                              <button
                                className={`carousel-button ${
                                  month === activeMonth ? "button-active" : ""
                                }`}
                                onClick={() => {
                                  handleMonthClick(month);
                                  setActiveMonth(month);
                                }}
                              >
                                {month}
                              </button>
                            </div>
                          ))}
                        </Carousel>
                      </div>
                      <div className="date_range_filter">
                        <TextField
                          sx={{
                            "& > :not(style)": { width: "24ch" },
                          }}
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
                        />
                        <TextField
                          sx={{
                            "& > :not(style)": { width: "24ch" },
                          }}
                          id="end-date"
                          label={
                            language === "hindi" ? "End Date" : "अंतिम तिथि"
                          }
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
                        />
                      </div>
                      <div className="search_filter_guard_entry">
                        <SearchFilterForFirstTab />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="entries_Show ">
                    {selectedMonth ? (
                      selectedMonth && (
                        <ul className="entries_Show_ul ">
                          {groupedData[activeMonth] &&
                          filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                              <li key={index} className="content_div mt-3">
                                <div className="border top_card_heading">
                                  {item.entryType}
                                </div>
                                <Card
                                  className="card_shadow"
                                  sx={{
                                    width: 370,
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                    border: "none",
                                    borderBottomRightRadius: "8px",
                                    borderBottomLeftRadius: "8px",
                                  }}
                                >
                                  <CardHeader
                                    avatar={
                                      <Avatar aria-label="recipe">
                                        <img
                                          className="entry_user_image"
                                          src={`/${item?.image[0]?.replace(
                                            "public/",
                                            ""
                                          )}`}
                                          alt=""
                                        />
                                      </Avatar>
                                    }
                                    title={item.entryType || item.name}
                                    subheader={item.submitedDate}
                                    action={
                                      <Tooltip
                                        title={
                                          language === "english"
                                            ? "अधिक विवरण देखें"
                                            : "View more deatils"
                                        }
                                        placement="top"
                                        arrow
                                      >
                                        <h5
                                          className="view_maid_attandance"
                                          onClick={() =>
                                            handleOpenOccasionalView(item._id)
                                          }
                                        >
                                          <IoEyeSharp />
                                        </h5>
                                      </Tooltip>
                                    }
                                  />

                                  <CardContent>
                                    <div className="card_purpose_content">
                                      {" "}
                                      <b>
                                        {language === "english"
                                          ? "उद्देश्य"
                                          : "Purpose "}
                                      </b>{" "}
                                      &nbsp;
                                      <span className="details_card">
                                        {item.purposeType}
                                      </span>
                                    </div>
                                    <div className="card_purpose_content">
                                      {" "}
                                      <b>
                                        {language === "english"
                                          ? "मकान नंबर"
                                          : "House No. "}
                                      </b>{" "}
                                      &nbsp;
                                      <span className="details_card">
                                        {JSON.parse(item.houseDetails).houseNo
                                          ? JSON.parse(item.houseDetails)
                                              .houseNo
                                          : JSON.parse(item.houseDetails)}
                                      </span>
                                    </div>

                                    <div className="card_clock">
                                      <div className="card_clock_in">
                                        <b>
                                          {" "}
                                          {language === "english"
                                            ? "कार्य आरंभ"
                                            : " In"}
                                        </b>{" "}
                                        &nbsp;
                                        <GoArrowDownLeft className="down_icon" />
                                        {item.submitedTime}
                                      </div>
                                      <div className="card_clock_out">
                                        <b className="">
                                          {language === "english"
                                            ? "कार्य समाप्ति"
                                            : " Out"}
                                        </b>{" "}
                                        &nbsp;
                                        <GoArrowUpRight className="up_icon" />
                                        {item && item.clockOut ? (
                                          item.clockOut
                                        ) : (
                                          <div
                                            className="requrie_button"
                                            onClick={() =>
                                              handleClockOut(item._id)
                                            }
                                          >
                                            <MdErrorOutline />
                                            &nbsp;
                                            {language === "english"
                                              ? "आवश्यक"
                                              : "Require"}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </li>
                            ))
                          ) : (
                            <div className="guardEntry_No_data">
                              {language === "english"
                                ? "कोई डेटा नहीं"
                                : "No Data"}
                            </div>
                          )}
                        </ul>
                      )
                    ) : (
                      <>
                        {" "}
                        <ul className="entries_Show_ul ">
                          <div className="guardEntry_No_data">
                            {" "}
                            {language === "english"
                              ? "कोई डेटा नहीं"
                              : "No Data"}
                          </div>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="regular_month_list" style={{ width: "100%" }}>
                <div className="regular_month_div_tab_two">
                  <Carousel
                    className="carousel_width"
                    showArrows={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    emulateTouch={true}
                    selectedItem={monthsList.indexOf(selectedMonthYear)}
                    onChange={(index) =>
                      setSelectedMonthYear(monthsList[index])
                    }
                  >
                    {monthsList.map((monthYear, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleMonthClicks(monthYear);
                          setSelectedMonthYear(monthYear);
                        }}
                        style={{
                          cursor: "pointer",
                          color:
                            selectedMonthYear === monthYear ? "blue" : "black",
                          fontWeight:
                            selectedMonthYear === monthYear
                              ? "light"
                              : "normal",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        {monthYear}
                      </div>
                    ))}
                  </Carousel>
                </div>
                <div className="search_filter_guard_entry">
                  <SearchFilterForSecTab />
                </div>
              </div>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  height: 384,
                }}
              >
                <Tabs
                  className="mt-2"
                  orientation="vertical"
                  variant="scrollable"
                  value={valueRegular}
                  onChange={handleChangeRegular}
                  aria-label="Vertical tabs example"
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    width: 250,
                  }}
                >
                  {loadingRegularEntries ? (
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
                    filteredEntries.map((entry, index) => (
                      <Tab
                        index={index}
                        key={entry._id}
                        label={`${entry.titleEnglish}`}
                        {...a11yProps(index)}
                        onClick={() => handleGetIdRegularEntries(entry._id)}
                      />
                    ))
                  ) : (
                    <div className="no_data_in_modal">
                      {language === "english" ? "कोई डेटा नहीं" : "No Data"}
                    </div>
                  )}
                </Tabs>

                {loadingRegularEntries ? (
                  <div className="guard_regular_entries_loader">
                    <div className="three_circle_loader ">
                      <ThreeCircles
                        visible={true}
                        height={100}
                        width={100}
                        color="#5e72e4"
                        ariaLabel="three-circles-loading"
                      />
                    </div>
                  </div>
                ) : filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, index) => (
                    <TabPanel key={index} value={valueRegular} index={index}>
                      <div className="regular_entries_div">
                        <div className="content_regular_data">
                          {filteredDataSecTab.length > 0 ? (
                            filteredDataSecTab.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <div className="border top_card_heading">
                                  {item.houseMaidEnglish}
                                </div>
                                <Card
                                  sx={{
                                    width: 330,
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                    border: "none",
                                    borderBottomRightRadius: "8px",
                                    borderBottomLeftRadius: "8px",
                                  }}
                                >
                                  <CardHeader
                                    avatar={
                                      <Avatar aria-label="recipe">
                                        <img
                                          className="entry_user_image"
                                          src={`/${
                                            item && item.image && item.image[0]
                                              ? item.image[0].replace(
                                                  "public/",
                                                  ""
                                                )
                                              : "path/to/placeholder.jpg"
                                          }`}
                                          alt=""
                                        />
                                      </Avatar>
                                    }
                                    title={item.houseMaidEnglish}
                                    subheader={item.submitedDate}
                                    action={
                                      <Tooltip
                                        title={
                                          language === "english"
                                            ? "उपस्थिति देखें"
                                            : "View Attendance"
                                        }
                                        placement="top"
                                        arrow
                                      >
                                        <h5
                                          className="view_maid_attandance"
                                          onClick={() =>
                                            handleOpenRegularMaidView(item._id)
                                          }
                                        >
                                          <IoEyeSharp />
                                        </h5>
                                      </Tooltip>
                                    }
                                  />
                                  <CardContent>
                                    <div className="card_purpose_content">
                                      {" "}
                                      <b>
                                        {" "}
                                        {language === "english"
                                          ? "लिंग"
                                          : "Gender"}
                                      </b>{" "}
                                      &nbsp;
                                      <span className="details_card">
                                        {item.gender}
                                      </span>
                                    </div>
                                    <div className="card_purpose_content">
                                      {" "}
                                      <b>
                                        {language === "english"
                                          ? "आधार संख्या"
                                          : "Aadhaar No."}
                                      </b>{" "}
                                      &nbsp;
                                      <span className="details_card">
                                        {item.aadharNumber}
                                      </span>
                                    </div>
                                    <div className="card_purpose_content">
                                      {" "}
                                      <b>
                                        {language === "english"
                                          ? "पता"
                                          : "Address"}
                                      </b>{" "}
                                      &nbsp;
                                      <span className="details_card">
                                        {item.address}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </li>
                            ))
                          ) : (
                            <div className="guardEntry_No_data">
                              {language === "english"
                                ? "कोई डेटा नहीं"
                                : "No Data"}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabPanel>
                  ))
                ) : (
                  <div className="no_data_in_modal">
                    {language === "english" ? "कोई डेटा नहीं" : "No Data"}
                  </div>
                )}
              </Box>
              {/* <div className="pagination_sec_tab">
                {totalPagesSecondTab > 1 && filteredDataSecTab.length > 0 && (
                  <Pagination
                    count={totalPagesSecondTab}
                    page={currentPageSecondTab}
                    onChange={handlePageChangeSecondTab}
                    color="primary"
                  />
                )}
              </div> */}
              <ToastContainer style={{ zIndex: "-1000" }} />
            </CustomTabPanel>
          </Box>
        </Dialog>

        {/* view House Maid Attendance      */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openRegularMaidView}
          onClose={handleCloseRegularMaidView}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openRegularMaidView}>
            <Box sx={style}>
              <div className="table_cross_icon">
                <RxCross2
                  onClick={handleCloseRegularMaidView}
                  className="icon_table"
                />
              </div>
              {/* <DateAndTimeFilter
                onDateFilter={handleDateFilter}
                onDateClearFilter={handleDateClearFilter}
              /> */}
              <Paper>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.id}
                          >
                            <TableCell align="center">
                              {item.maidName}
                            </TableCell>
                            <TableCell align="center">
                              {item.submittedDate}
                            </TableCell>
                            <TableCell align="center">
                              <GoArrowDownLeft className="down_icon" />{" "}
                              {item.clockInTime}
                            </TableCell>
                            <TableCell align="center">
                              <GoArrowUpRight className="up_icon" />{" "}
                              {item.clockOutTime
                                ? item.clockOutTime
                                : "MISSING"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableCell colSpan={5}>
                          <h6 align="center">
                            {" "}
                            {language === "english"
                              ? "कोई डेटा नहीं"
                              : "No data"}
                          </h6>
                        </TableCell>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={getAttendance.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          </Fade>
        </Modal>

        {/* //View OccasionalView */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openOccasionalView}
          onClose={handleCloseOccasionalView}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openOccasionalView}>
            <Box sx={style}>
              <div className="table_cross_icon">
                <RxCross2
                  onClick={handleCloseOccasionalView}
                  className="icon_table"
                />
              </div>

              <Paper>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columnsOccasionalEntries.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {particularOccasionalEntryLoader ? (
                        <>
                          <div className="entry_data_view_loader">
                            <ThreeCircles
                              visible={true}
                              height={70}
                              width={70}
                              color="#5e72e4"
                              ariaLabel="three-circles-loading"
                            />
                          </div>
                        </>
                      ) : (
                        getParticularOccasionalEntry.map((item) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.id}
                          >
                            <TableCell align="center">
                              {item.name ? item.name : "Not Added"}
                            </TableCell>
                            <TableCell align="center">
                              {item.purposeType}
                            </TableCell>
                            <TableCell align="center">
                              {item.phoneNumber
                                ? item.phoneNumber
                                : "Not Added"}
                            </TableCell>
                            <TableCell align="center">
                              {JSON.parse(item.houseDetails).houseNo}
                            </TableCell>
                            <TableCell align="center">
                              {JSON.parse(item.houseDetails).owner
                                ? JSON.parse(item.houseDetails).owner
                                : JSON.parse(item.houseDetails).ownerName}
                            </TableCell>
                            <TableCell align="center">
                              <img
                                className="entry_user_occasional_image"
                                src={`/${item?.image[0]?.replace(
                                  "public/",
                                  ""
                                )}`}
                                alt=""
                              />
                            </TableCell>
                            <TableCell align="center">
                              <GoArrowDownLeft className="down_icon" />
                              {item.submitedTime}
                            </TableCell>
                            <TableCell align="center">
                              <GoArrowUpRight className="up_icon" />
                              {item.clockOut ? item.clockOut : "In Society"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Fade>
        </Modal>
      </React.Fragment>
    </div>
  );
};

export default AddEntriesPage;
