import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Backbutton from "../GoBack/Backbutton";
import axios from "axios";
import { PORT } from "../Api/api";
import { ToastContainer, toast } from "react-toastify";
import { ThreeCircles } from "react-loader-spinner";
import { LanguageContext } from "../lib/LanguageContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LuAlarmClock } from "react-icons/lu";
import GuardLayout from "../lib/GuardLayout";
import Navbar from "../Navbar/Navbar";
import { IoIosArrowBack } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
const getCurrentTime = () => {
  const currentDate = new Date();
  const ISTTime = currentDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
  });
  return `${ISTTime}`;
};
function VerfiedUser({ setCurrentStep }) {
  const { language } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaidList, setFilteredMaidList] = useState([]);
  const [maidName, setMaidName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const params = useParams();
  const id = params.id;
  const guardId = JSON.parse(localStorage.getItem("guardId"));
  const society_id = JSON.parse(localStorage.getItem("society_id"))||null;
  useEffect(() => {
    const getMaid = async () => {
      try {
        const response = await axios.get(`${PORT}/getVerifieUser/${id}`);
        setMaidName(response.data.verifyHouseMaid);
        setFilteredMaidList(response.data.verifyHouseMaid);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getMaid();
  }, [id]);
  const [clockInOut, setClockOut] = useState(false);
  const [maidClockStatus, setMaidClockStatus] = useState({});

  const handleSubmit = async (item, index, clockOutTime, clockInTime) => {
    console.log(id,"item")
    setClockOut(true);
    const maidData = maidName[index].houseMaidEnglish;
    const currentTime = getCurrentTime();

    try {
      const response = await axios.post(`${PORT}/verified`, {
        maidName: maidData,
        parentId: item,
        guardId: guardId,
        clockInTime: clockOutTime !== null ? currentTime : "",
        clockOutTime: clockInTime ? null : currentTime,
        createdBy:id,
        society_id:society_id
      });

      if (response.data.message === "User clocked in successfully") {
        // toast.success();
        alert("Clock In")
        const updatedStatus = { clockIn: true, clockOut: false };
        localStorage.setItem(item, JSON.stringify(updatedStatus));
        setMaidClockStatus((prevStatus) => ({
          ...prevStatus,
          [item]: updatedStatus,
        }));
      } else {
        alert("Clock Out")
        // toast.success("Clock Out");
        const updatedStatus = { clockIn: false, clockOut: true };
        localStorage.setItem(item, JSON.stringify(updatedStatus));
        setMaidClockStatus((prevStatus) => ({
          ...prevStatus,
          [item]: updatedStatus,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update data");
    }
  };
  // MaidCLockStatus
  useEffect(() => {
    const fetchClockStatus = async () => {
      try {
        const maidStatus = {};
        for (const maid of maidName) {
          const status = localStorage.getItem(maid._id);
          if (status) {
            maidStatus[maid._id] = JSON.parse(status);
          }
        }

        setMaidClockStatus(maidStatus);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClockStatus();
  }, [maidName]);
  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredMaidList(
      maidName.filter((maid) =>
        maid.houseMaidEnglish?.toLowerCase().includes(query)
      )
    );
  };

  const getEntries = async () => {
    try {
      const response = await axios.get(`${PORT}/getEntries`);
      const responseData = response.data.data;
      setData(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEntries();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <GuardLayout>
        <Navbar />
        <ToastContainer />
        <div className="purpose-heading">
          <div className="regular_entries_btn">
            <Tooltip
              title={language === "english" ? "  पिछला पृष्ठ" : "Previous Page"}
              placement="top"
              arrow
            >
              <div className="back-btn mt-4">
                <button onClick={() => navigate(-1)}>
                  <IoIosArrowBack />
                </button>
                &nbsp;
                <b className="back_text verified_back_text ">
                  {language === "english" ? "  पिछला" : "Back"}
                </b>
              </div>
            </Tooltip>
          </div>
          <div className="purpose_title">
            {data.map(
              (item) =>
                item.entryType === "Regular" &&
                item._id === id && (
                  <h1 key={item._id}>
                    {language === "english"
                      ? `${item.titleEnglish} की सूची `
                      : `List of ${item.titleEnglish}`}
                  </h1>
                )
            )}
          </div>
          <div className="search-container">
            <input
              type="text"
              className="regular_entries_search_input"
              placeholder={
                language === "hindi" ? "Search by name" : "नाम से खोजें"
              }
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        {loading ? (
          <div className="three_circle_loader three_circle_loader_verify_Entry">
            <ThreeCircles
              visible={true}
              height="100"
              width="100"
              color="#5e72e4"
              ariaLabel="three-circles-loading"
            />
          </div>
        ) : (
          <div className="purpose-sec m-font">
            {filteredMaidList.length > 0 ? (
              filteredMaidList.map((item, index) => (
                <div
                  onClick={() => handleSubmit(item._id, index)}
                  className="specific-person"
                  key={index}
                >
                  <div className="entry_image">
                    <div>
                      {maidClockStatus[item._id]?.clockIn && (
                        <div className="clockInOut">
                          <h6 className="clockInMark"></h6>
                        </div>
                      )}
                    </div>

                    {item?.image?.length > 0 ? (
                      <img
                        src={`/${item.image[0].replace("public/", "")}`}
                        alt=""
                      />
                    ) : (
                      <div className="entry_placeholder">
                        <div className="entry_image_div entry_image_first_letter_div">
                          <h6 className="first_word">
                            {item.houseMaidEnglish.charAt(0).toUpperCase()}
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="entry_name">{item.houseMaidEnglish}</p>
                </div>
              ))
            ) : (
              <div className="data_not regular_entry_not_found">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png"
                  alt="Data not found"
                />
                <h1>Entry not found</h1>
              </div>
            )}
          </div>
        )}
      </GuardLayout>
     
    </>
  );
}
export default VerfiedUser;
