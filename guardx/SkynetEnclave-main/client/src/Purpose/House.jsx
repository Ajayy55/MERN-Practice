import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PORT } from "../Api/api";
import Backbutton from "../GoBack/Backbutton";
import { GiHouse } from "react-icons/gi";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import { ThreeCircles } from "react-loader-spinner";
import "./style.css";
import Navbar from "../Navbar/Navbar";
import { LanguageContext } from "../lib/LanguageContext";
import { useContext } from "react";
import GuardLayout from "../lib/GuardLayout";
import { DataContext } from "../lib/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { IoIosArrowBack } from "react-icons/io";
function House({ prevStep, nextStep }) {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { houseDetailss, filteredByHouseNos, houseLoading } =
    useContext(DataContext);
  const [houseDetail, setHouseDetails] = useState(houseDetailss);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredByHouseNo, setFilteredByHouseNo] =
    useState(filteredByHouseNos);
  const [loading, setLoading] = useState(true);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const society_id = JSON.parse(localStorage.getItem("society_id"));

  useEffect(() => {
    setHouseDetails(houseDetailss);
    setFilteredByHouseNo(filteredByHouseNos);
  }, [houseDetailss, filteredByHouseNos]);
  const handleSubmit = (item) => {
    localStorage.setItem("house_id", JSON.stringify(item._id));
    localStorage.setItem("house", JSON.stringify(item));
    nextStep();
  };
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = houseDetail.filter((item) => {
      return (
        item.houseNo?.toLowerCase().includes(query) ||
        item.ownerName?.toLowerCase().includes(query)
      );
    });
    setFilteredByHouseNo(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredByHouseNo(houseDetail);
  };
  return (
    <>
      <GuardLayout>
        <div className="entry_heading_div">
          <div className="entry-heading">
            <h1 className="m-font">
              {language === "english" ? "कहाँ जाना है" : "Where to visit"}
            </h1>
          </div>
          <div className="entry_search_filter">
            <h5>
              <Box sx={{ "& > :not(style)": { m: 1, width: "30ch" } }}>
                <TextField
                  id="search-input"
                  label={
                    language === "english"
                      ? "घर क्रमांक या मालिक द्वारा खोजें"
                      : "Search..."
                  }
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="search-input"
                  InputProps={{
                    endAdornment: searchQuery && (
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#5e72e4;",
                        borderWidth: "1px",
                        borderRadius: "5px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#5e72e4;",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5e72e4;",
                      },
                      "& .MuiInputLabel-root.Mui-error": {
                        color: "red",
                      },
                    },
                  }}
                />
              </Box>
            </h5>
          </div>
        </div>
        <div className="purpose-sec m-font">
          {Array.isArray(filteredByHouseNo) && filteredByHouseNo.length > 0 ? (
            houseLoading ? (
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
              filteredByHouseNo?.map((item, index) => (
                <div
                  className="specific-person "
                  key={index}
                  onClick={() => handleSubmit(item)}
                >
                  <div className="entry_image">
                    <>
                      <div className="entry_placeholder">
                        {(() => {
                          let words;

                          words = item?.houseNo?.split(" ");
                          const initials =
                            words && words[0].substring(0, 1).toUpperCase();

                          return (
                            <>
                              <div className="entry_image_div">
                                <b className="first_word">{initials}</b>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </>
                  </div>
                  <b className="styling_house_no">{item.houseNo}</b>
                  <p className="owner_name_heading">
                    {" "}
                    <span className="owner_title">Owner</span> {item.ownerName}{" "}
                  </p>
                </div>
              ))
            )
          ) : (
            <div className="data_not regular_entry_not_found">
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png"
                alt="Data not found"
              />
              <h1>
                {language === "english"
                  ? "घर का नंबर या मालिक नहीं मिला"
                  : "House number or owner not found"}
              </h1>
            </div>
          )}
        </div>
        <div>
          <Tooltip
            title={language === "english" ? "  पिछला पृष्ठ" : "Previous Page"}
            placement="top"
            arrow
          >
            <div className="back-btn">
              <button onClick={prevStep}>
                <IoIosArrowBack />
              </button>
              &nbsp;
              <b className="back_text">
                {language === "english" ? "  पिछला" : "Back"}
              </b>
            </div>
          </Tooltip>
        </div>
      </GuardLayout>
    </>
  );
}

export default House;
