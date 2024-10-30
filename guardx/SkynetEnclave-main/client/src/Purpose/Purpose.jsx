import React, { useEffect, useState } from "react";
import "./style.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { ThreeCircles } from "react-loader-spinner";
import GuardLayout from "../lib/GuardLayout";
import { LanguageContext } from "../lib/LanguageContext";
import { useContext } from "react";
import { DataContext } from "../lib/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { IoIosArrowBack } from "react-icons/io";
function Purpose({ data, nextStep, prevStep }) {
  const { purposeLoading } = useContext(DataContext);
  const { language } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [purposeData, setPurposeData] = useState(data);
  const [filteredPurpose, setFilteredPurpose] = useState(data);
  useEffect(() => {
    setSearchQuery("");
  }, []);
  const handleNavigate = (index) => {
    nextStep();
    localStorage.setItem("purpose", JSON.stringify(purposeData[index].purpose));
  };
  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = purposeData?.filter((item) => {
      return item.purpose?.toLowerCase().includes(query.trim());
    });
    setFilteredPurpose(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredPurpose(purposeData);
  };

  return (
    <>
      <GuardLayout>
        <div className="entry_heading_div">
          <div className="entry-heading">
            <h1 className="m-font">
              {language === "english" ? "आने का उद्देश्य" : "Purpose of visit"}
            </h1>
          </div>
          <div className="entry_search_filter">
            <h5>
              <Box sx={{ "& > :not(style)": { m: 1, width: "30ch" } }}>
                <TextField
                  id="search-input"
                  label={
                    language === "english"
                      ? "उद्देश्य द्वारा खोजें"
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
          {purposeLoading ? (
            <div className="three_circle_loader">
              <ThreeCircles
                visible={true}
                height={100}
                width={100}
                color="#5e72e4"
                ariaLabel="three-circles-loading"
              />
            </div>
          ) : filteredPurpose?.length > 0 ? (
            filteredPurpose.map((item, index) => (
              <div
                className="specific-person"
                key={index}
                onClick={() => handleNavigate(index)}
              >
                <div className="entry_image">
                  {item.purposeIcon.length > 0 ? (
                    <img
                      src={`/${item?.purposeIcon.replace("public/", "")}`}
                      alt=""
                    />
                  ) : (
                    <div className="entry_placeholder">
                      {(() => {
                        let words;

                        words = item?.purpose.split(" ");

                        const initials = words[0].substring(0, 1).toUpperCase();

                        return (
                          <div className="entry_image_div">
                            <b className="first_word">{initials}</b>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <p className="entry_name_purpose">{item.purpose}</p>
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
                  ? "उद्देश्य नहीं मिला"
                  : "Purpose not found"}
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

export default Purpose;
