import React, { useContext, useState, useEffect } from "react";
import Layout from "../../lib/Layout";
import "./calendar.css";
import axios from "axios";
import { PORT } from "../../Api/api";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { GrNext, GrPrevious } from "react-icons/gr";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import Tooltip from "@mui/material/Tooltip";
import { LanguageContext } from "../../lib/LanguageContext";
import { ThreeCircles } from "react-loader-spinner";
import useSearchFilter from "./useSearchFIlter";
import { RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import usePagination from "@mui/material/usePagination/usePagination";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { CgCloseO } from "react-icons/cg";
const DailyAttendance = () => {
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const [getRegularUserAccToAttendance, setGetRegularUserAccToAttendance] =
    useState([]);
  const [
    getOccasionalUserAccToAttendance,
    setGetOccasionalUserAccToAttendance,
  ] = useState([]);
  const [value, setValue] = useState(dayjs());
  const [valueOccasional, setValueOccasional] = useState(dayjs());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [dateChangedOccasional, setDateChangedOccasional] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemOccasional, setActiveItemOccasional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingOccasional, setLoadingOccasional] = useState(false);
  const { language } = useContext(LanguageContext);
  const [searchKeys, setSearchKeys] = useState("maidName");
  const [isRegular, setIsRegular] = useState(true);
  // Pagination Page
  const itemsPerPage = 10;
  const { query, setQuery, filteredData, filterDataOccasional } =
    useSearchFilter(
      getRegularUserAccToAttendance,
      getOccasionalUserAccToAttendance,
      searchKeys
    );
  const {
    currentPage,
    totalPages,
    paginateData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = usePagination(filteredData, itemsPerPage);

  const navigate = useNavigate();
  // Fetch entries
  const handleToGetRegularData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${PORT}/getMaidEntry`);
      const res = response.data.data;
      const selectedDate = dayjs(value).format("DD-MM-YYYY");
      const filterUserAccToData = res
        .filter((entry) => entry.society_id === society_id)
        .filter(
          (entry) =>
            dayjs(entry.submittedDate, "DD-MM-YYYY").format("DD-MM-YYYY") ===
            selectedDate
        );
      const combinedData = filterUserAccToData.reduce((acc, entry) => {
        const userName = entry.maidName;
        const date = entry.submittedDate;
        if (!acc[userName]) {
          acc[userName] = {
            maidName: userName,
            date: date,
            times: [
              { clockIn: entry.clockInTime, clockOut: entry.clockOutTime },
            ],
          };
        } else {
          acc[userName].times.push({
            clockIn: entry.clockInTime,
            clockOut: entry.clockOutTime,
          });
        }
        return acc;
      }, {});

      const finalData = Object.values(combinedData);
      setGetRegularUserAccToAttendance(finalData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Handle next day button
  const handleNextDay = () => {
    setValue((prevValue) => prevValue.add(1, "day"));
    setDateChanged(true);
  };
  // Handle previous day button
  const handlePrevDay = () => {
    setValue((prevValue) => prevValue.subtract(1, "day"));
    setDateChanged(true);
  };

  useEffect(() => {
    if (society_id) {
      handleToGetRegularData();
    }
  }, [value]);
  const handleDateChange = (newValue) => {
    setLoading(true);
    setValue(newValue);
    setIsDatePickerOpen(false);
    setDateChanged(true)
  };

  // Clear filter function
  const handleClearFilter = () => {
    const currentDate = dayjs();
    setValue(currentDate);
    setIsDatePickerOpen(false);
    setDateChanged(false);
    setQuery("");
  };

  const handleDailyNavigate = () => {
    navigate("/admin/calender/daily");
  };
  const handleWeeklyNavigate = () => {
    navigate("/admin/calender/weekly");
  };
  const handleMonthlyNavigate = () => {
    navigate("/admin/calender/monthly");
  };
  //Export Functionlaity  in Excel and Csv
  let csvLink = React.createRef();
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData?.flatMap((item) =>
        item?.times?.map((time) => ({
          MaidName: item.maidName,
          ClockIn: time.clockIn,
          ClockOut: time.clockOut || "In Society",
        }))
      )
    );
    // Set column widths
    worksheet["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Regular Entries.xlsx");
  };
  const csvData = filteredData.flatMap((item) =>
    item.times.map((time) => ({
      Name: item.maidName,
      "Clock-In": time.clockIn,
      "Clock-Out": time.clockOut || "In Society",
    }))
  );
  const handleExport = (type) => {
    if (type === "excel") {
      exportToExcel();
    } else if (type === "csv") {
      csvLink.current.link.click();
    }
  };
  //handle Occasional Entries Filter
  const fetchData = async () => {
    setLoadingOccasional(true);
    try {
      const response = await axios.get(`${PORT}/getData`);
      const res = await response.data.data;

      const selectedDate = dayjs(valueOccasional).format("DD-MM-YYYY");

      const filterUserAccToData = res
        .filter((entry) => entry?.society_id === society_id)
        .filter(
          (entry) =>
            dayjs(entry.submitedDate, "DD-MM-YYYY").format("DD-MM-YYYY") ===
            selectedDate
        );
      const filterDataAccSociety = res.filter(
        (entry) => entry.society_id === society_id
      );
      setGetOccasionalUserAccToAttendance(filterUserAccToData);
      setLoadingOccasional(false);
      if (isRegular) {
        setSearchKeys("maidName");
      } else {
        setSearchKeys("entryType");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (society_id) {
      fetchData(activeItemOccasional);
    }
  }, [valueOccasional]);
  //handleDate Change Filter
  const handleDateChangeOccasionalEntries = (newValue) => {
    setLoadingOccasional(true);
    setValueOccasional(newValue);
    setIsDatePickerOpen(false);
    fetchData();
    setDateChangedOccasional(true)
  };
  const handleNextDayOccasional = () => {
    setValueOccasional((prevValue) => prevValue.add(1, "day"));
    setDateChangedOccasional(true);
  };
  const handlePrevDayOccasional = () => {
    setValueOccasional((prevValue) => prevValue.subtract(1, "day"));
    setDateChangedOccasional(true);
  };
  //Export Functionlaity For Occasional Entries
  let csvLinkOccasionalEntries = React.createRef();
  const handleOccasionalEntriesExport = (type) => {
    if (type === "excel") {
      handleToExportOccasionalEntries();
    } else if (type === "csv") {
      csvLinkOccasionalEntries.current.link.click();
    }
  };
  const handleToExportOccasionalEntries = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filterDataOccasional?.map((item) => ({
        Name: item.entryType,
        "Clock-In": item.submitedDate,
        "Clock-Out": item.clockOut || "In Society",
      }))
    );
    // Set column widths
    worksheet["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Occasional Entries.xlsx");
  };

  const csvDataToOccaasionalEntries = filterDataOccasional?.map((item) => ({
    Name: item.entryType,
    "Clock-In": item.submitedDate,
    "Clock-Out": item.clockOut || "In Society",
  }));
  //Clear Occasional Entries Filter
  const handleClearFilterForOccasional = () => {
    const currentDate = dayjs();
    setValueOccasional(currentDate);
    setIsDatePickerOpen(false);
    setDateChangedOccasional(false);
    setQuery("");
  };
  const handleToggleCalendar = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };
  return (
    <div>
      <Layout>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12 ">
              <div className="card mb-4">
                <div className=" calendar_main">
                  <div className="calendar ">
                    <DropdownButton
                      className="dropdown_btn"
                      title={language === "english" ? " दैनिक " : "Daily "}
                    >
                      <Dropdown.Item onClick={handleDailyNavigate}>
                        {language === "english" ? " दैनिक " : "Daily "}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleWeeklyNavigate}>
                        {language === "english" ? "  साप्ताहिक " : "Weekly"}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleMonthlyNavigate}>
                        {language === "english" ? "मासिक" : "Monthly"}
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                  &nbsp;  &nbsp;  &nbsp;  &nbsp;  
                  <div className="calender-search">
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
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          name="name"
                          autoComplete="off"
                        />
                        <RiSearchLine className="search-icon" />
                      </div>
                    </div>
                  </div>
                  {isRegular === true ? (
                    <div className="date">
                      <div className="calendar_carousel">
                        <Tooltip
                          title={language === "hindi" ? "Previous" : "पिछला"}
                          placement="top"
                          arrow
                        >
                          <div className="prev-day-btn" onClick={handlePrevDay}>
                            <GrPrevious className="prev-day-btn_icon" />
                          </div>
                        </Tooltip>
                        &nbsp;&nbsp;
                        <div
                          className="day-display"
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        >
                          {dayjs(value).format("dddd, DD-MM-YYYY")}
                        </div>
                        &nbsp;&nbsp;
                        <Tooltip
                          title={language === "hindi" ? "Next" : "अगला"}
                          placement="top"
                          arrow
                        >
                          <div className="next-day-btn" onClick={handleNextDay}>
                            <GrNext />
                          </div>
                        </Tooltip>
                        <div className="daily-attendance-show-calender">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                          
                         
                            {isDatePickerOpen && (
                              <>
                                 <div 
                                 variant="outlined"
                                 onClick={handleToggleCalendar}
                                 // style={{ marginBottom: '10px' }}
                               >
                                <CgCloseO className="calender-close-button"/>
                               </div>
                              <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                value={value}
                              onChange={handleDateChange}
                                renderInput={() => null}
                              />
                              </>
                            )}
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="date">
                        <div className="calendar_carousel">
                          <Tooltip
                            title={
                              language === "english" ? "Previous" : "पिछला"
                            }
                            placement="top"
                            arrow
                          >
                            <div
                              className="prev-day-btn"
                              onClick={handlePrevDayOccasional}
                            >
                              <GrPrevious className="prev-day-btn_icon" />
                            </div>
                          </Tooltip>
                          &nbsp;&nbsp;
                          <div
                            className="day-display"
                            onClick={() =>
                              setIsDatePickerOpen(!isDatePickerOpen)
                            }
                          >
                            {dayjs(valueOccasional).format("dddd, DD-MM-YYYY")}
                          </div>
                          &nbsp;&nbsp;
                          <Tooltip
                            title={language === "english" ? "Next" : "अगला"}
                            placement="top"
                            arrow
                          >
                            <div
                              className="next-day-btn"
                              onClick={handleNextDayOccasional}
                            >
                              <GrNext />
                            </div>
                          </Tooltip>
                          <div className="daily-attendance-show-calender">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {isDatePickerOpen && (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {isDatePickerOpen && (
                                  <StaticDatePicker
                                    displayStaticWrapperAs="desktop"
                                    value={valueOccasional}
                                    onChange={handleDateChangeOccasionalEntries}
                                    renderInput={() => null}
                                  />
                                )}
                              </LocalizationProvider>
                            )}
                          </LocalizationProvider>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="clear_filter_main">
                    {dateChanged && isRegular === true ? (
                      <div className="calender_clear_filter">
                        <Tooltip
                          title={
                            language === "english"
                              ? "फ़िल्टर हटाएं"
                              : " Clear Filter"
                          }
                          placement="top"
                          arrow
                        >
                          <button
                            className="clear-filter-btn-weekly"
                            onClick={handleClearFilter}
                          >
                            {language === "english" ? "हटाएं" : " Clear "}
                          </button>
                        </Tooltip>
                      </div>
                    ) : (
                      dateChangedOccasional && (
                        <div className="calender_clear_filter">
                          <Tooltip
                            title={
                              language === "english"
                                ? "फ़िल्टर हटाएं"
                                : " Clear Filter"
                            }
                            placement="top"
                            arrow
                          >
                            <button
                              className="clear-filter-btn-weekly"
                              onClick={handleClearFilterForOccasional}
                            >
                              {language === "english" ? "हटाएं" : " Clear "}
                            </button>
                          </Tooltip>
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <DropdownButton
                      className="dropdown_btn-r"
                      id="regular-export-dropdown" 
                  
                      title={isRegular===true? language === "english" ? "नियमित" : "    Regular":language === "english" ? "आवधिक" : " Occasional"}
                    >
                      <Dropdown.Item onClick={() => setIsRegular(true)}>
                        {language === "english" ? "नियमित" : "    Regular"}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setIsRegular(false)}>
                        {language === "english" ? "आवधिक" : " Occasional"}
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                  <div>
                    {isRegular === true ? (
                      <div className="">
                        <DropdownButton
                          className="dropdown_btn-o"
                          title={language === "english" ? "निर्यात" : " Export"}
                           id="occasional-export-dropdown"
                        >
                          <Dropdown.Item onClick={() => handleExport("excel")}>
                            {language === "english"
                              ? "एक्सेल में निर्यात करें"
                              : " Export to Excel"}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleExport("csv")}>
                            {language === "english"
                              ? " CSV में निर्यात करें"
                              : "Export to CSV"}
                          </Dropdown.Item>
                        </DropdownButton>
                        <CSVLink
                          data={csvData}
                          filename={"Regular Entries.csv"}
                          className="hidden"
                          ref={csvLink}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="">
                          <DropdownButton
                            className="dropdown_btn"
                            title={
                              language === "english" ? "निर्यात" : " Export"
                            }
                          >
                            <Dropdown.Item
                              onClick={() =>
                                handleOccasionalEntriesExport("excel")
                              }
                            >
                              {language === "english"
                                ? "एक्सेल में निर्यात करें"
                                : " Export to Excel"}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleOccasionalEntriesExport("csv")
                              }
                            >
                              {language === "english"
                                ? " CSV में निर्यात करें"
                                : "Export to CSV"}
                            </Dropdown.Item>
                          </DropdownButton>
                          <CSVLink
                            data={csvDataToOccaasionalEntries}
                            filename={"Occasional Entries.csv"}
                            className="hidden"
                            ref={csvLinkOccasionalEntries}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="calendar_content">
                  {
                    <div className="daily-report">
                      <table className="report-table">
                        <thead className="thead_reports">
                          <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Clock-In</th>
                            <th className="text-center">Clock-Out</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isRegular === true ? (
                            loading ? (
                              <tr>
                                <td colSpan={6}>
                                  <div className="">
                                    <div className="three_circle_loader">
                                      <ThreeCircles
                                        visible={true}
                                        height={100}
                                        width={100}
                                        color="#5e72e4"
                                        ariaLabel="three-circles-loading"
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : filteredData.length > 0 ? (
                              filteredData.map((item, index) =>
                                item.times.map((time, timeIndex) => (
                                  <tr key={`${index}-${timeIndex}`}>
                                    <td className="text-center">
                                      {item.maidName}
                                    </td>
                                    <td className="text-center">
                                      {" "}
                                      <GoArrowDownLeft className="down-icon mx-2 text-success" />
                                      {time.clockIn}
                                    </td>
                                    <td className="text-center">
                                      <GoArrowUpRight className="up-icon mx-2 text-danger" />{" "}
                                      {time.clockOut
                                        ? time.clockOut
                                        : "In Society"}
                                    </td>
                                  </tr>
                                ))
                              )
                            ) : (
                              <tr>
                                <td colSpan={6}>
                                  <div className="calender_no_data">
                                    No records found
                                  </div>
                                </td>
                              </tr>
                            )
                          ) : loadingOccasional ? (
                            <tr>
                              <td colSpan={6}>
                                <div>
                                  <div className="three_circle_loader">
                                    <ThreeCircles
                                      visible={true}
                                      height={100}
                                      width={100}
                                      color="#5e72e4"
                                      ariaLabel="three-circles-loading"
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : filterDataOccasional.length > 0 ? (
                            filterDataOccasional.map((item, index) => (
                              <tr key={`${index}`}>
                                <td className="text-center">
                                  {item.entryType}
                                </td>
                                <td className="text-center">
                                  {" "}
                                  <GoArrowDownLeft className="down-icon mx-2 text-success" />
                                  {item.submitedTime}
                                </td>
                                <td className="text-center">
                                  <GoArrowUpRight className="up-icon mx-2 text-danger" />{" "}
                                  {item.clockOut ? item.clockOut : "In Society"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6}>
                                <div className="calender_no_data">
                                  No records found
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  }
                </div>
                <div>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>

                  <p>
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default DailyAttendance;
