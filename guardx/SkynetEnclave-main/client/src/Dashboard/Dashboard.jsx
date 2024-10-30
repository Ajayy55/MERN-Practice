import React, { useContext, useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../css2/all.css";
import axios from "axios";
import "./style.css";
import { FaLocationArrow } from "react-icons/fa";
import { ThreeCircles } from "react-loader-spinner";
import { PORT } from "../Api/api";
import { GrDocumentVerified } from "react-icons/gr";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaHouseUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Layout from "../lib/Layout";
import { LanguageContext } from "../lib/LanguageContext";
import { MdPermIdentity } from "react-icons/md";
const Dashboard = () => {
  const { language } = useContext(LanguageContext);
  const [chartData, setChartData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: [],
        backgroundColor: ["purple", "yellow", "teal", "pink"],
        borderRadius: 5,
      },
    ],
  });
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const roleType = JSON.parse(localStorage.getItem("role"));
  const [valueData, setValueData] = useState();
  const [lableForRequest, setLableForRequest] = useState();
  const [monthlyDataGuest, setMonthlyDataGuest] = useState();
  const [monthDataRegular, setmonthDataRegular] = useState();
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [data, setData] = useState([]);
  const [regularEntries, setRegularEntries] = useState([]);
  const [typeOfEntries, setTypeOfEntries] = useState([]);
  const [houseDetails, setHouseDetails] = useState([]);
  const [purposeData, setPurposeData] = useState([]);
  const [entriesLengthBySuperAdmin, setEntriesLengthBySuperAdmin] = useState(0);
  const [purposeLengthBySuperAdmin, setPurposeLengthBySuperAdmin] = useState(0);
  function formatLength(length) {
    if (length >= 1000000) {
      return (length / 1000000).toFixed(1) + "M";
    } else if (length >= 1000) {
      return (length / 1000).toFixed(1) + "k";
    }
    return length.toString();
  }
  const fetchData = async () => {
    try {
      const response = await axios.get(`${PORT}/getData`);
      const filterData = response.data.data.filter(
        (item) => item.society_id === society_id
      );
      const dataLength = filterData.length;
      setValueData(dataLength);

      const dataSubmittedDate = filterData.map((item) => item.submitedDate);
      const dataSubmittedDateJs = dataSubmittedDate.map((days) => {
        const newDateFormat = days.replace(/-/g, "/");
        const [day, months, years] = newDateFormat.split("/");
        let date = new Date(`${years}-${months}-${day}`);
        let month = date.toLocaleString("default", { month: "long" });
        let year = date.getFullYear();
        setMonthlyDataGuest(year);
        return `${month} ${year}`;
      });
      const allMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentYear = new Date().getFullYear();
      const monthYearCounts = {};
      allMonths.forEach((month) => {
        monthYearCounts[`${month} ${currentYear}`] = 0;
      });

      dataSubmittedDateJs.forEach((date) => {
        const monthYear = new Date(date).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        monthYearCounts[monthYear] += 1;
      });

      const result = {};
      Object.keys(monthYearCounts).forEach((monthYear) => {
        const [month, year] = monthYear.split(" ");
        if (!result[month]) {
          result[month] = {};
        }
        result[month] = monthYearCounts[monthYear];
      });
      setChartDataLoading(false);
      setChartData({
        labels: allMonths.map((month) => month.substring(0, 3)),
        datasets: [
          {
            data: allMonths.map((month) => result[month] || 0),

            backgroundColor: [
              "purple",
              "yellow",
              "teal",
              "pink",
              "orange",
              "green",
              "blue",
              "red",
              "brown",
              "cyan",
              "magenta",
              "gray",
            ],
            borderRadius: 5,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [chartDataBar, setChartDataBar] = useState({
    labels: ["1st Week", "2nd Week", "3rd Week", "4th Week"],
    datasets: [
      {
        data: [],
        backgroundColor: ["purple", "yellow", "teal", "pink"],
        borderRadius: 5,
      },
    ],
  });

  const fetchDataForRequest = async () => {
    try {
      const response = await axios.get(`${PORT}/getData`);
      const filterData = response.data.data.filter(
        (item) => item.society_id === society_id
      );
      // Create an object to store data for each week
      const dataSubmittedDate = filterData.map((item) => {
        const newDateFormat = item.submitedDate?.replace(/-/g, "/");
        const [day, months, years] = newDateFormat.split("/");
        setmonthDataRegular(years);
        let date = new Date(`${years}-${months}-${day}`);
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate)
          ? parsedDate
          : null;
      });

      let latestMonth = null;
      const allWeeks = ["1st Week", "2nd Week", "3rd Week", "4th Week"];

      // Find the latest month
      dataSubmittedDate.forEach((date) => {
        if (date) {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const monthKey = `${year}-${month}`;

          if (!latestMonth || latestMonth.key < monthKey) {
            latestMonth = { key: monthKey, year, month };
          }
        }
      });

      const latestMonthData = dataSubmittedDate.filter((date) => {
        if (date) {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const monthKey = `${year}-${month}`;
          return monthKey === latestMonth.key;
        }
        return false;
      });

      const weekData = allWeeks.map((week, index) => {
        const weekNumber = index + 1;
        const entriesForWeek = latestMonthData.filter((date) => {
          const dateWeekNumber = Math.ceil(date.getDate() / 7);
          return dateWeekNumber === weekNumber;
        });
        return entriesForWeek.length;
      });

      const chartData = {
        labels: allWeeks,
        datasets: [
          {
            data: weekData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            borderColor: "black",
          },
        ],
      };

      setChartDataBar(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataForRequest();
  }, []);

  //  regular Entries tota
  useEffect(() => {
    const filteredEntries = data.filter((item) => item.entryType === "Regular");
    setRegularEntries(filteredEntries);
  }, [data]);
  // handle entries
  const getEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const responseData = response.data.data;
      const filterData = responseData.filter(
        (item) => item.society_id === society_id
      );
      setData(filterData);
      setTypeOfEntries(filterData);
      const entriesLengthForSuperAdmin = responseData.filter(
        (item) => item.defaultPermissionLevel == "1"
      );
      setEntriesLengthBySuperAdmin(
        formatLength(entriesLengthForSuperAdmin.length)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEntries();
  }, [data]);

  //get house Details
  const handleData = async () => {
    try {
      const response = await axios.get(`${PORT}/getHouseDetails`);
      const responseData = response.data.data;
      const filterData = responseData.filter(
        (item) => item.society_id === society_id
      );

      setHouseDetails(filterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  //get purpose list
  const handleSubmit = async () => {
    try {
      const result = await axios.get(`${PORT}/getUserNonVerfiedPrupose`);
      const responseData = result.data.data;
      const filterData = responseData.filter(
        (item) => item.society_id === society_id
      );

      setPurposeData(filterData);
      const purposeLengthForSuperAdmin = responseData.filter(
        (item) => item.defaultPermissionLevel == "1"
      );
      setPurposeLengthBySuperAdmin(
        formatLength(purposeLengthForSuperAdmin.length)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [purposeData]);
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [regularEntriesAttendence, setRegularEntriesAttendence] = useState({
    labels: allMonths.map((month) => month.slice(0, 3)),
    datasets: [
      {
        label: "Dataset 1",

        data: [],

        borderColor: "rgb(255,99,132)",
      },
    ],
  });

  const [regularChartLoading, setRegularChartLoading] = useState(true);
  const [regularEntriesData, setRegularEntriesData] = useState();
  const [regularEntriesDataList, setRegularEntriesDataList] = useState();
  const [regularEntriesName, setRegularEntriesName] = useState();
  const [verifyHouseMaidLength, setVerifyHouseMaidLength] = useState([]);
  useEffect(() => {
    const filteredEntries = regularEntriesData?.filter(
      (item) => item?.entryType === "Regular"
    );

    const filterData = filteredEntries?.filter(
      (item) => item.society_id === society_id
    );

    const dataName =
      filterData?.length > 0 &&
      filterData?.map((item) => {
        const newDateFormat = item?.joiningDate?.replace(/-/g, "/");
        const [day, months, years] = newDateFormat.split("/");
        const formattedDate = new Date(`${years}-${months}-${day}`);
        const month = formattedDate.toLocaleString("default", {
          month: "long",
        });
        const year = formattedDate.getFullYear();
        return [item.titleEnglish, `${month}`];
      });

    setRegularEntriesName(dataName);

    const dataId = filterData?.map((item) => {
      return item._id;
    });
    const fetchData = async () => {
      try {
        if (dataId && Array.isArray(dataId)) {
          const promises = dataId.map((id) =>
            axios.get(`${PORT}/getVerifieUser/${id}`)
          );
          const responses = await Promise.all(promises);
          const lengths = responses.map(
            (res) => res.data.verifyHouseMaid.length
          );

          const getSubmitedDate = responses.map(
            (res) => res.data.verifyHouseMaid
          );
          setVerifyHouseMaidLength(lengths);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const datasets =
      regularEntriesName &&
      regularEntriesName.map((user, index) => ({
        label: dataName[index][0],
        data: allMonths.map((month, i) => {
          const dataIndex = dataName.filter(
            ([_, m]) => dataName[index][1] === month
          );

          return dataIndex.length > 0 ? verifyHouseMaidLength[index] : 0;
        }),
        borderColor: [
          "purple",
          "yellow",
          "teal",
          "pink",
          "orange",
          "green",
          "blue",
          "red",
          "brown",
          "cyan",
          "magenta",
          "gray",
        ],
      }));

    setRegularEntriesAttendence({
      ...regularEntriesAttendence,
      datasets: datasets,
    });
  }, [data]);
  const getEntriesForAttendence = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const responseData = response.data.data;
      setRegularEntriesData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEntriesForAttendence();
  }, [data]);
  // Usage example:
  const regularEntriesLength = regularEntries?.length || 0;
  const regularFormattedLength = formatLength(regularEntriesLength);
  const purposeDataLength = purposeData?.length || 0;
  const purposeFormatLength = formatLength(purposeDataLength);
  const houseDetailsLength = houseDetails?.length || 0;
  const houseDetailsFormatLength = formatLength(houseDetailsLength);
  const typeOfEntriesLength = typeOfEntries?.length || 0;
  const typeOfEntriesFormatLength = formatLength(typeOfEntriesLength);
  //ProfileSetting
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [auth, setAuth] = React.useState(true);
  const [guardData, setGuardData] = useState({});
  const guardImage = guardData?.Ownerimage?.replace("public/", "");
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  useEffect(() => {
    const getGuardData = async () => {
      try {
        const response = await axios.get(
          `${PORT}/getEditWithSocietyUnion/${id}`
        );
        setGuardData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching guard data:", error);
      }
    };
    getGuardData();
  }, []);

  const handleSettingFunctionality = () => {
    navigate("/admin/profilesetting");
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("roleId"));
  const handleLogoutFunctionlaity = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const getCurrentTime = () => {
          const now = new Date();
          let hours = now.getHours();
          const amOrPm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const minutes = now.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes} ${amOrPm}`;
        };

        const guardLogin = async () => {
          try {
            const currentTime = getCurrentTime();
            const response = await axios.post(`${PORT}/guardLogin`, {
              createdBy: id,
              clockInTime: currentTime,
              clockOutTime: null,
            });
            localStorage.clear();
            navigate("/login");
          } catch (error) {
            console.error("Error logging in guard:", error);
          }
        };

        guardLogin();
      }
    });
  };
  const handleAttendanceFunctionlaity = () => {
    navigate("/admin/attendance");
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  //Dashboard Show according top Role

  //SocietyLength
  const [societyDataLength, setSocietyDataLength] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [societyYear, setSocietyYear] = useState();
  const [societyChartLength, setSocietyChartLength] = useState({
    labels: [],
    datasets: [
      {
        label: "Entries Per Month",
        data: [],
        borderColor: "#5e72e4",
        backgroundColor: "rgba(94, 114, 228, 0.1)",
      },
    ],
  });

  useEffect(() => {
    const getSocietyData = async () => {
      try {
        const response = await axios.get(`${PORT}/getSocietyData`);
        const data = response.data.societyData;
        setSocietyDataLength(data);
        const dateCounts = Array(12).fill(0);

        data.forEach((item) => {
          const [day, month, year] = item.submitedDate.split("-").map(Number);
          setSocietyYear(year);
          const monthIndex = month - 1;
          dateCounts[monthIndex]++;
        });

        const labels = [
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

        setSocietyChartLength({
          labels,
          datasets: [
            {
              label: "Society Per Month",
              data: dateCounts,
              borderColor: "#5e72e4",
              backgroundColor: "rgba(94, 114, 228, 0.1)",
            },
          ],
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching society data:", error);
        setIsLoading(false);
      }
    };

    getSocietyData();
  }, [PORT]);

  const [userLength, setUserLength] = useState([]);
  const getSignUpUser = async () => {
    try {
      await axios.get(`${PORT}/getUserWithSocietyUser`).then(async (res) => {
        const response = await res.data.data;
        setUserLength(response);
      });
    } catch (error) {}
  };

  useEffect(() => {
    getSignUpUser();
  }, []);
  return (
    <Layout>
      <div>
        {roleType === 1 || roleType === 2 ? (
          <>
            <div className="container-fluid py-4">
              <div className="row">
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8">
                          <div className="numbers">
                            <p className="text-sm mb-0  numbers_heading text-uppercase font-weight-bold">
                              {}
                              {language === "hindi" ? "Society" : " सोसाइटी"}
                            </p>
                            <h5 className="font-weight-bolder">
                              {societyDataLength?.length}
                            </h5>
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                {language === "hindi" ? "Society" : " सोसाइटी"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div
                            className="icon icon-shape 
                        bg-gradient-primary shadow-primary text-center rounded-circle"
                          >
                            <FaHouseUser className="dashboard_icons"></FaHouseUser>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8">
                          <div className="numbers">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold">
                              {language === "hindi" ? " User" : "  उपयोगकर्ता"}
                            </p>
                            <h5 className="font-weight-bolder">
                              {userLength?.length}
                            </h5>
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                {language === "hindi"
                                  ? " User"
                                  : "  उपयोगकर्ता"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                            <MdPermIdentity className="dashboard_icons" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8">
                          <div className="numbers">
                            <p className="text-sm mb-0  numbers_heading text-uppercase font-weight-bold">
                              {language === "hindi"
                                ? "Type of Entries"
                                : "  प्रविष्टियों का प्रकार"}
                            </p>
                            <h5 className="font-weight-bolder">
                              {entriesLengthBySuperAdmin}
                            </h5>
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                {language === "hindi"
                                  ? "Type of Entries"
                                  : "  प्रविष्टियों का प्रकार"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                            <FaLocationArrow className="dashboard_icons" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-8">
                          <div className="numbers">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold">
                              {language === "hindi" ? " Purpose" : "  उद्देश्य"}
                            </p>
                            <h5 className="font-weight-bolder">
                              {purposeLengthBySuperAdmin}
                            </h5>
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                {language === "hindi"
                                  ? " Purpose"
                                  : "  उद्देश्य"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                            <AiOutlineQuestionCircle className="dashboard_icons" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* // ChartJS */}
              <div className="row mt-4 ">
                <br />
                <br />
                <div className="col-lg-12 mb-lg-0 mb-4 mt-4">
                  <div className="card z-index-2 h-100">
                    <div className="card-header pb-0 pt-3 bg-transparent">
                      <h6 className="text-capitalize">
                        {language === "hindi" ? "Society" : " सोसाइटी"}
                      </h6>
                      <p className="text-sm mb-0">
                        <i className="fa fa-arrow-up text-success"></i>
                        <span className="font-weight-bold"></span> in{" "}
                        {societyYear}
                      </p>
                      {isLoading ? (
                        <div className="chartdata_loader">
                          <ThreeCircles
                            visible={true}
                            height={50}
                            width={50}
                            color="#5e72e4"
                            ariaLabel="three-circles-loading"
                          />
                        </div>
                      ) : societyChartLength.datasets[0].data.length ? (
                        <Line
                          data={societyChartLength}
                          options={{
                            scales: {
                              x: {
                                ticks: {
                                  color: "black",
                                },
                              },
                              y: {
                                min: 0,
                                ticks: {
                                  color: "black",
                                },
                              },
                            },
                            responsive: true,
                            plugins: {
                              legend: {
                                labels: {
                                  color: "black",
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <p>No data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0  numbers_heading text-uppercase font-weight-bold">
                            {}
                            {language === "hindi"
                              ? "Regular Entries"
                              : " नियमित प्रविष्टियाँ "}
                          </p>
                          <h5 className="font-weight-bolder">
                            {regularFormattedLength}
                          </h5>
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              {language === "hindi"
                                ? "Regular Entries"
                                : " नियमित प्रविष्टियाँ "}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div
                          className="icon icon-shape 
                        bg-gradient-primary shadow-primary text-center rounded-circle"
                        >
                          <GrDocumentVerified className="dashboard_icons"></GrDocumentVerified>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0  numbers_heading text-uppercase font-weight-bold">
                            {language === "hindi"
                              ? "Type of Entries"
                              : "  प्रविष्टियों का प्रकार"}
                          </p>
                          <h5 className="font-weight-bolder">
                            {typeOfEntriesFormatLength}
                          </h5>
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              {language === "hindi"
                                ? "Type of Entries"
                                : "  प्रविष्टियों का प्रकार"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                          <FaLocationArrow className="dashboard_icons" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">
                            {language === "hindi" ? " Purpose" : "  उद्देश्य"}
                          </p>
                          <h5 className="font-weight-bolder">
                            {purposeFormatLength}
                          </h5>
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              {language === "hindi" ? " Purpose" : "  उद्देश्य"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                          <AiOutlineQuestionCircle className="dashboard_icons" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">
                            {language === "hindi"
                              ? " House List"
                              : "     घर सूची"}
                          </p>
                          <h5 className="font-weight-bolder">
                            {houseDetailsFormatLength}
                          </h5>
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              {language === "hindi"
                                ? " House List"
                                : "     घर सूची"}
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                          <FaHouseUser className="dashboard_icons" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* // ChartJS */}
            <div className="row mt-4 ">
              <div className="col-lg-6 mb-lg-0 mb-4">
                <div className="card z-index-2 h-100">
                  <div className="card-header pb-0 pt-3 bg-transparent">
                    <h6 className="text-capitalize">
                      {language === "hindi"
                        ? "Monthly Guest Entries Requests"
                        : "मासिक अतिथि प्रविष्टि अनुरोध"}
                    </h6>
                    <p className="text-sm mb-0">
                      <i className="fa fa-arrow-up text-success"></i>
                      <span className="font-weight-bold"></span> in{" "}
                      {monthlyDataGuest}
                    </p>
                    {chartDataLoading ? (
                      <div className="chartdata_loader">
                        <ThreeCircles
                          visible={true}
                          height={50}
                          width={50}
                          color="#5e72e4"
                          ariaLabel="three-circles-loading"
                        />
                      </div>
                    ) : (
                      <Bar
                        className="a"
                        data={chartData}
                        options={{
                          scales: {
                            x: {
                              ticks: {
                                color: "black",
                              },
                            },
                            y: {
                              min: 0,
                              ticks: {
                                color: "black",
                              },
                            },
                          },
                          responsive: true,
                          plugins: {
                            legend: {
                              labels: {
                                color: "black",
                              },
                              display: false,
                            },
                            title: {
                              display: true,
                              text:
                                language === "hindi"
                                  ? "Monthly Guest Entries Requests"
                                  : "मासिक अतिथि प्रविष्टि अनुरोध",
                              color: "black",
                            },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-lg-0 mb-4">
                <div className="card z-index-2 h-100">
                  <div className="card-header pb-0 pt-3 bg-transparent">
                    <h6 className="text-capitalize">
                      {language === "hindi"
                        ? " Weekly Guest Entries Requests"
                        : "साप्ताहिक अतिथि प्रविष्टि अनुरोध"}
                    </h6>
                    <p className="text-sm mb-0">
                      <i className="fa fa-arrow-up text-success"></i>
                      <span className="font-weight-bold"></span> in{" "}
                      {monthlyDataGuest}
                    </p>
                    {chartDataLoading ? (
                      <div className="chartdata_loader">
                        <ThreeCircles
                          visible={true}
                          height={50}
                          width={50}
                          color="#5e72e4"
                          ariaLabel="three-circles-loading"
                        />
                      </div>
                    ) : (
                      <Line
                        data={chartDataBar}
                        options={{
                          scales: {
                            x: {
                              ticks: {
                                color: "black",
                              },
                            },
                            y: {
                              min: 0,

                              ticks: {
                                color: "black",
                              },
                            },
                          },
                          responsive: true,
                          plugins: {
                            legend: {
                              labels: {
                                color: "black",
                              },
                              display: false,
                            },
                            title: {
                              display: true,
                              text:
                                language === "hindi"
                                  ? " Weekly Guest Entries Requests"
                                  : "साप्ताहिक अतिथि प्रविष्टि अनुरोध",
                              color: "black",
                            },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div className="col-lg-12 mb-lg-0 mb-4 mt-4">
                <div className="card z-index-2 h-100">
                  <div className="card-header pb-0 pt-3 bg-transparent">
                    <h6 className="text-capitalize">
                      {language === "hindi"
                        ? "Regular Entries Attendance"
                        : " नियमित प्रविष्टियाँ उपस्थिति"}
                    </h6>
                    <p className="text-sm mb-0">
                      <i className="fa fa-arrow-up text-success"></i>
                      <span className="font-weight-bold"></span> in{" "}
                      {monthDataRegular}
                    </p>
                    {regularEntriesAttendence?.datasets?.length > 0 ? (
                      <Line
                        data={regularEntriesAttendence}
                        options={{
                          scales: {
                            x: {
                              ticks: {
                                color: "black",
                              },
                            },
                            y: {
                              min: 0,
                              ticks: {
                                color: "black",
                              },
                            },
                          },
                          responsive: true,
                          plugins: {
                            legend: {
                              labels: {
                                color: "black",
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <>
                        {" "}
                        <div className="chartdata_loader">
                          <ThreeCircles
                            visible={true}
                            height={50}
                            width={50}
                            color="#5e72e4"
                            ariaLabel="three-circles-loading"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
