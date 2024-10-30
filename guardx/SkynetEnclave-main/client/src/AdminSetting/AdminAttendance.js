import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import axios from "axios";
import { PORT } from "../Api/api";
import { IoArrowBack } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./profile.css";
import { GoArrowDownLeft } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import { LanguageContext } from "../lib/LanguageContext";
import Loading from "../Loading/Loading";
const AdminAttendance = () => {
  const { language } = useContext(LanguageContext);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [getGuardData, setGuardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;
  const handleBack = () => {
    navigate(-1);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("roleId"));
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
       
      } catch (error) {
        console.error("Error fetching guard data:", error);
        setLoadingPermission(false);
      }
    };
    getGuardData();
  }, [id]);
  useEffect(() => {
    const getGuardAtendance = async () => {
      await axios.get(`${PORT}/getGuardInOut`).then(async (res) => {
        const response = await res.data.data;
        const filterData = response
          .filter((item) => item.createdBy === id)
        setLoadingPermission(false);
        setGuardData(filterData?.reverse());
        setTotalPages(Math.ceil(filterData?.length / perPage));
      });
    };
    getGuardAtendance();
  }, [id]);

  const [getOnwerName, setGetOwnerName] = useState([]);
  useEffect(() => {
    const getSocietyOwnerName = async () => {
      await axios.get(`${PORT}/getUserWithSocietyUser`).then(async (res) => {
        const filterData = res.data.data.filter((item) => item._id === id);
        setGetOwnerName(filterData[0]);
      });
    };
    getSocietyOwnerName();
  }, [id]);

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
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };
  return (
    <div>
      <div className="My_attendance">
        <IoArrowBack onClick={handleBack} className="back_profile_icon" />
        &nbsp;&nbsp;
        <span>
          {" "}
          {language === "english" ? "मेरी उपस्थिति" : "  My attendance  "}
        </span>
      </div>

      {loadingPermission ? (
      <Loading/>
      
      ) : (
        <div className="attendance_div">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th className="text-dark  text-center  text-xxm font-weight-bolder opacity-7">
                  {language === "english" ? "तारीख" : "   Date  "}
                </th>
                <th className="text-dark   text-center  text-xxm font-weight-bolder opacity-7">
                  {language === "english" ? "कार्य आरंभ" : "   Clock-In   "}
                </th>
                <th className="text-dark   text-center  text-xxm font-weight-bolder opacity-7">
                  {language === "english"
                    ? "कार्य समाप्ति"
                    : "    Clock-Out   "}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle text-center">{formatDate(item.date)}</td>
                  <td className="align-middle text-center">
                    <GoArrowDownLeft className="down_icon" /> {item.clockInTime}
                  </td>
                  <td className="align-middle text-center">
                    <GoArrowUpRight className="up_icon" />{" "}
                    {item.clockOutTime ? item.clockOutTime : "MISSING"}
                  </td>
                </tr>
              ))}
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
  );
};

export default AdminAttendance;
