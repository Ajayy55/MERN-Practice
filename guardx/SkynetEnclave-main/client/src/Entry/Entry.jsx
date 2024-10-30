import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThreeCircles } from "react-loader-spinner";
import Swal from "sweetalert2";
import GuardLayout from "../lib/GuardLayout";
import { LanguageContext } from "../lib/LanguageContext";
import { DataContext } from "../lib/DataContext";
function Entry({ nextStep }) {
  const { occasionalEntriess, regularEntriess, loadingEntry, loadingRegular } =
    useContext(DataContext);
  const { language } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(occasionalEntriess);
  const [displayMode, setDisplayMode] = useState(
    localStorage.getItem("displayMode") || "occasional"
  );
  const [showRegularTitle, setShowRegularTitle] = useState(
    language === "english" ? "कर्मचारी उपस्थिति" : "Staff Attendance"
  );
  const [selectedTab, setSelectedTab] = useState(
    localStorage.getItem("selectedTab") || "one"
  );
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setFilteredData(
      displayMode === "regular" ? regularEntriess : occasionalEntriess
    );
    setShowRegularTitle(
      displayMode === "regular"
        ? language === "english"
          ? " मेहमान प्रविष्टियाँ"
          : "Guest Entries"
        : language === "english"
        ? "कर्मचारी उपस्थिति"
        : "Staff Attendance"
    );
    localStorage.setItem("displayMode", displayMode);
    localStorage.setItem("selectedTab", selectedTab);
  }, [displayMode, regularEntriess, occasionalEntriess, language, selectedTab]);

  useEffect(() => {
    const isAuthenticated = JSON.parse(localStorage.getItem("guardAccess"));
    if (isAuthenticated?.role === 5) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const data = JSON.parse(localStorage.getItem("guardAccess"));
      if (data && new Date().getTime() >= data.expiresAt) {
        localStorage.removeItem("guardAccess");
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Your session has expired due to inactivity. Please log in again.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      (displayMode === "regular" ? regularEntriess : occasionalEntriess).filter(
        (item) => item.titleEnglish?.toLowerCase().includes(query.trim())
      )
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredData(
      displayMode === "regular" ? regularEntriess : occasionalEntriess
    );
  };

  const handleEntriesRegularOrOccasional = () => {
    setDisplayMode((prevMode) =>
      prevMode === "occasional" ? "regular" : "occasional"
    );
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setDisplayMode(tab === "one" ? "occasional" : "regular");
  };

  const handleSubmit = (item, index) => {
    if (item.entryType === "Regular") {
      navigate(`/verified-user/${item._id}`);
    } else {
      nextStep(2, item.createdBy);
      localStorage.setItem("entry", JSON.stringify(item.titleEnglish));
    }
  };
  return (
    <GuardLayout>
      <div className="entry_main">
        <div className="entry_heading_div">
          <div className="entry-heading">
            <h1 className="m-font">
              {language === "english" ? "प्रवेश का प्रकार" : "Type of Entry"}
            </h1>
          </div>
          <div
            className="regular_entries_btn_div"
            onClick={handleEntriesRegularOrOccasional}
          >
            <div className="inner_regular_entries_btn_div">
              <p className="regular_entries_btn">{showRegularTitle}</p>
            </div>
          </div>
          <div className="entry_search_filter">
            <h5>
              <Box sx={{ "& > :not(style)": { m: 1, width: "30ch" } }}>
                <TextField
                  id="search-input"
                  label={
                    language === "english" ? "प्रवेश द्वारा खोजें" : "Search..."
                  }
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#5e72e4",
                        borderWidth: "1px",
                        borderRadius: "5px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#5e72e4",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5e72e4",
                      },
                    },
                  }}
                />
              </Box>
            </h5>
          </div>
        </div>
        <div className="purpose-sec">
          {loadingEntry || loadingRegular ? (
            <div className="three_circle_loader">
              <ThreeCircles
                visible={true}
                height={100}
                width={100}
                color="#5e72e4"
                ariaLabel="three-circles-loading"
              />
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                onClick={() => handleSubmit(item, index)}
                key={index}
                className="specific-person"
              >
                <div className="entry_image">
                  {item.icon ? (
                    <img src={`/${item.icon.replace("public/", "")}`} alt="" />
                  ) : (
                    <div className="entry_placeholder">
                      <div className="entry_image_div">
                        <b className="first_word">
                          {item.titleEnglish?.charAt(0).toUpperCase() || ""}
                        </b>
                      </div>
                    </div>
                  )}
                </div>
                <p className="entry_name">{item.titleEnglish}</p>
              </div>
            ))
          ) : (
            <div className="data_not regular_entry_not_found">
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png"
                alt="Data not found"
              />
              <h1>
                {language === "english"
                  ? "एंट्री नहीं मिली"
                  : "Entry not found"}
              </h1>
            </div>
          )}
        </div>
      </div>
    </GuardLayout>
  );
}

export default Entry;
