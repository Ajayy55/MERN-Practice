import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { PORT } from "../Api/api";
import { IoArrowBack } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import GuardLayout from "../lib/GuardLayout";
import Navbar from "../Navbar/Navbar";
import { LanguageContext } from "../lib/LanguageContext";
import { GoArrowDownLeft } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
const GuardAttendance = () => {
  const { language } = useContext(LanguageContext);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  // Handle back function
  const handleBack = () => {
    navigate(-1);
  };
  const location = useLocation();
  const id = JSON.parse(localStorage.getItem("guardId"));
  const navigate = useNavigate();
  const [getGuardData, setGuardData] = useState([]);
  const guardname = JSON.parse(localStorage.getItem("guardName"));
  const guardIdLocalStorage = JSON.parse(localStorage.getItem("guardId"));
  useEffect(() => {
    if (location.pathname === "/showAttendance") {
      const guardname = JSON.parse(localStorage.getItem("guardName"));
      if (!guardname) {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);
  const [guardUserName, setGuardUserName] = useState({});
  useEffect(() => {
    const getGuardData = async () => {
      try {
        const response = await axios.get(
          `${PORT}/getEditWithSocietyUnion/${id}`
        );
        const res = await response.data.data[0];
        setGuardUserName(res);
        setLoadingPermission(false);
      } catch (error) {
        console.error("Error fetching guard data:", error);
        setLoadingPermission(false);
      }
    };
    getGuardData();
  }, []);
  useEffect(() => {
    const getGuardAtendance = async () => {
      await axios.get(`${PORT}/getGuardInOut`).then((res) => {
        const response = res.data.data;
        const filterData = response.filter(
          (item) => item.guardId === guardIdLocalStorage
        );
        setLoadingPermission(false);
        setGuardData(filterData.reverse());
        setTotalPages(Math.ceil(filterData.length / perPage));
      });
    };
    getGuardAtendance();
  }, []);
  // Calculate the pagination data
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, getGuardData.length);
  const currentPageData =
    getGuardData.length > 0
      ? getGuardData.slice(startIndex, endIndex)
      : getGuardData.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <GuardLayout>
      <Navbar />
      <div>
        <div className="My_attendance">
          <IoArrowBack onClick={handleBack} className="back_profile_icon" />
          &nbsp;&nbsp;
          <span>
            {" "}
            {language === "english"
              ? "मेरी उपस्थिति"
              : "  My attendance  "}{" "}
          </span>
        </div>
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
        ) : (
          <div className="attendance_div">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                    {language === "english" ? "तारीख" : "   Date  "}
                  </th>
                  <th className="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                    {language === "english" ? "कार्य आरंभ" : "   Clock-In   "}
                  </th>
                  <th className="text-dark  text-center  text-sm font-weight-bolder opacity-7">
                    {language === "english"
                      ? "कार्य समाप्ति"
                      : "    Clock-Out   "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="align-middle text-center">{item.date}</td>
                      <td className="align-middle text-center">
                        {" "}
                        <GoArrowDownLeft className="down_icon" />{" "}
                        {item.clockInTime}
                      </td>
                      <td className="align-middle text-center">
                        <GoArrowUpRight className="up_icon" />{" "}
                        {item.clockOutTime?item.clockOutTime:"In Society"}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3}>
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
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GuardLayout>
  );
};

export default GuardAttendance;
