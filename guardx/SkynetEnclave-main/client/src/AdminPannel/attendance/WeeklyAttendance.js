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
import isoWeek from "dayjs/plugin/isoWeek";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import Tooltip from "@mui/material/Tooltip";
import { LanguageContext } from "../../lib/LanguageContext";
import { ThreeCircles } from "react-loader-spinner";
import useSearchFilter from "./useSearchFIlter";
import { RiSearchLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { CgCloseO } from "react-icons/cg";

import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
dayjs.extend(isoWeek);
const WeeklyAttendance = () => {
  const [value, setValue] = useState(dayjs());
  const [valueOccasional, setValueOccasional] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [loadingOccasional, setLoadingOccasional] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [getRegularUserAccToAttendance, setGetRegularUserAccToAttendance] =
    useState([]);
  const [
    getOccasionalUserAccToAttendance,
    setGetOccasionalUserAccToAttendance,
  ] = useState([]);
  const [searchKeys, setSearchKeys] = useState("maidName");
  const { query, setQuery, filteredData, filterDataOccasional } =
    useSearchFilter(
      getRegularUserAccToAttendance,
      getOccasionalUserAccToAttendance,
      searchKeys
    );
  const [isRegular, setIsRegular] = useState(true);
  const [activeItemOccasional, setActiveItemOccasional] = useState(null);
  const [dateChangedOccasional, setDateChangedOccasional] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const { language } = useContext(LanguageContext);
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const navigate = useNavigate();
  const handleToGetRegularData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${PORT}/getMaidEntry`);
      const res = response.data.data;
      const startOfWeek = dayjs(value).startOf("isoWeek");
      const endOfWeek = dayjs(value).endOf("isoWeek");

      const filterUserAccToData = res
        .filter((entry) => entry.society_id === society_id)
        .filter((entry) => {
          const entryDate = dayjs(entry.submittedDate, "DD-MM-YYYY");
          return entryDate.isBetween(startOfWeek, endOfWeek, null, "[]");
        });
      const combinedData = filterUserAccToData.reduce((acc, entry) => {
        const userName = entry.maidName;
        const date = entry.submittedDate;
        if (!acc[userName]) {
          acc[userName] = {
            maidName: userName,
            week: [],
          };
        }
        acc[userName].week.push({
          date: date,
          clockIn: entry.clockInTime,
          clockOut: entry.clockOutTime || "In Society",
        });

        return acc;
      }, {});

      const finalData = Object.values(combinedData);
      setGetRegularUserAccToAttendance(finalData);
      console.log(finalData, "FinalData");
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDateChange = (newValue) => {
    setLoading(true);
    setValue(newValue);
    setIsDatePickerOpen(false);
    setDateChanged(true);
  };
  const handleNextWeek = () => {
    setValue((prevValue) => prevValue.add(1, "week"));
    setDateChanged(true);
  };
  const handlePrevWeek = () => {
    setValue((prevValue) => prevValue.subtract(1, "week"));
    setDateChanged(true);
  };
  useEffect(() => {
    if (society_id) {
      handleToGetRegularData();
    }
  }, [value]);
  const weekDisplay = `${dayjs(value)
    .startOf("isoWeek")
    .format("DD-MM-YYYY")} to ${dayjs(value)
    .endOf("isoWeek")
    .format("DD-MM-YYYY")}`;
  const handleClearFilter = () => {
    setValue(dayjs());
    setGetRegularUserAccToAttendance([]);
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
        item?.week?.map((time) => ({
          MaidName: item.maidName,
          ClockIn: time.clockIn,
          ClockOut: time.clockOut || "In Society",
        }))
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Regular Entries.xlsx");
  };
  const csvData = filteredData.flatMap((item) =>
    item.week.map((time) => ({
      MaidName: item.maidName,
      ClockIn: time.clockIn,
      ClockOut: time.clockOut || "In Society",
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
  const handleNextDayOccasional = () => {
    setValueOccasional((prevValue) => prevValue.add(1, "day"));
    setDateChangedOccasional(true);
  };
  const handlePrevDayOccasional = () => {
    setValueOccasional((prevValue) => prevValue.subtract(1, "day"));
    setDateChangedOccasional(true);
  };
  const handleDateChangeOccasionalEntries = (newValue) => {
    setLoadingOccasional(true);
    setValueOccasional(newValue);
    setIsDatePickerOpen(false);
    fetchData();
    setDateChangedOccasional(true);
  };
  useEffect(() => {
    if (society_id) {
      fetchData();
    }
  }, [valueOccasional]);
  // weekDisplayForOccasional
  const weekDisplayForOccasional = `${dayjs(valueOccasional)
    .startOf("isoWeek")
    .format("DD-MM-YYYY")} to ${dayjs(valueOccasional)
    .endOf("isoWeek")
    .format("DD-MM-YYYY")}`;
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
                      title={language === "english" ? "  साप्ताहिक " : "Weekly"}
                    >
                      <Dropdown.Item onClick={handleDailyNavigate}>
                        {language === "english" ? " दैनिक " : "Daily "}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleWeeklyNavigate}>
                        {language === "english" ? "  साप्ताहिक " : "Weelky"}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleMonthlyNavigate}>
                        {language === "english" ? "मासिक" : "Monthly"}
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
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
                    <div className="date ">
                      <div className="calendar_carousel_weekly">
                        <Tooltip
                          title={language === "hindi" ? "Previous" : "पिछला"}
                          placement="top"
                          arrow
                        >
                          <div
                            className="prev-week-btn"
                            onClick={handlePrevWeek}
                          >
                            <GrPrevious className="prev-week-btn_icon" />
                          </div>
                        </Tooltip>
                        &nbsp;&nbsp;
                        <div
                          className="week-display"
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        >
                          {weekDisplay}
                        </div>
                        &nbsp;&nbsp;
                        <Tooltip
                          title={language === "hindi" ? "Next" : "अगला"}
                          placement="top"
                          arrow
                        >
                          <div
                            className="next-week-btn"
                            onClick={handleNextWeek}
                          >
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
                                  <CgCloseO className="calender-close-button" />
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
                    <div className="date ">
                      <div className="calendar_carousel_weekly">
                        <Tooltip title="Previous Week" placement="top" arrow>
                          <div
                            className="prev-week-btn"
                            onClick={handlePrevDayOccasional}
                          >
                            <GrPrevious className="prev-week-btn_icon" />
                          </div>
                        </Tooltip>
                        &nbsp;&nbsp;
                        <div
                          className="week-display"
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        >
                          {weekDisplayForOccasional}
                        </div>
                        &nbsp;&nbsp;
                        <Tooltip title="Next Week" placement="top" arrow>
                          <div
                            className="next-week-btn"
                            onClick={handleNextDayOccasional}
                          >
                            <GrNext />
                          </div>
                        </Tooltip>
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                          {isDatePickerOpen && (
                            <DatePicker
                              label="Select Date"
                              value={value}
                              onChange={setValue}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          )}
                        </LocalizationProvider> */}
                        <div className="daily-attendance-show-calender">
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
                        </div>
                      </div>
                    </div>
                  )}
                  {/* //Clear Filter */}
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
                  {/* Regular And Occasional Filter */}
                  <div>
                    <DropdownButton
                      className="dropdown_btn"
                      title={
                        isRegular === true
                          ? language === "english"
                            ? "नियमित"
                            : "    Regular"
                          : language === "english"
                          ? "आवधिक"
                          : " Occasional"
                      }
                    >
                      <Dropdown.Item onClick={() => setIsRegular(true)}>
                        {language === "english" ? "नियमित" : "    Regular"}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setIsRegular(false)}>
                        {language === "english" ? "आवधिक" : " Occasional"}
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                  <div className="">
                    <DropdownButton
                      className="dropdown_btn"
                      title={
                        language === "english" ? "निर्यात विकल्प" : " Export"
                      }
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
                  </div>
                  <CSVLink
                    data={csvData}
                    filename={"Regular Entries.csv"}
                    className="hidden"
                    ref={csvLink}
                  />
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
                                item.week.map((time, timeIndex) => (
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
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default WeeklyAttendance;
