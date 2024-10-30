// import React, { useContext, useEffect, useState } from "react";
// import Layout from "../../../lib/Layout";
// import AddBackbtn from "../../../lib/AddBackbtn";
// import "./style.css";
// import { useNavigate } from "react-router-dom";
// import { LanguageContext } from "../../../lib/LanguageContext";
// import axios from "axios";
// import { PORT } from "../../../Api/api";
// import moment from "moment";
// import { RiSearchLine } from "react-icons/ri";
// import { MdDelete } from "react-icons/md";
// import { toast, ToastContainer } from "react-toastify";
// import FullViewAnnouncement from "../FullViewParticularAnnouncement.js/FullViewAnnouncement";
// import { ThreeCircles } from "react-loader-spinner";
// const ViewAnnouncement = () => {
//   const { language } = useContext(LanguageContext);
//   const [getAnnouncement, setGetAnnouncement] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const handleToAddAnnouncement = () => {
//     navigate("/admin/addAnnouncement");
//   };

//   const fetchAnnouncements = async () => {
//     try {
//       const response = await axios.get(`${PORT}getAnnouncement`);
//       const filterAnnouncementAccToSociety = response?.data?.data?.filter(
//         (item) => item.society_id === society_id
//       );

//       setGetAnnouncement(filterAnnouncementAccToSociety.reverse());
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   // Function to group by month and sort in reverse chronological order
//   const groupByMonth = (announcements) => {
//     const grouped = announcements.reduce((acc, announcement) => {
//       const month = moment(announcement.date, "DD-MM-YYYY").format("MMM YYYY");
//       if (!acc[month]) {
//         acc[month] = [];
//       }
//       acc[month].push(announcement);
//       return acc;
//     }, {});
//     return Object.keys(grouped)
//       .sort(
//         (a, b) =>
//           moment(b, "MMM YYYY").toDate() - moment(a, "MMM YYYY").toDate()
//       )
//       .reduce((acc, key) => {
//         acc[key] = grouped[key];
//         return acc;
//       }, {});
//   };

//   const groupedAnnouncements = groupByMonth(getAnnouncement);
//   const filteredAnnouncements =
//     selectedMonth && selectedMonth !== "All"
//       ? { [selectedMonth]: groupedAnnouncements[selectedMonth] }
//       : groupedAnnouncements;
//   const uniqueMonths = Object.keys(groupedAnnouncements);
//   const handleShowAll = () => {
//     setSelectedMonth("");
//     setSearchQuery("");
//   };
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };
//   // Filter announcements based on search query
//   const filteredBySearch = Object.keys(filteredAnnouncements).reduce(
//     (acc, month) => {
//       const announcementsInMonth = filteredAnnouncements[month].filter((item) =>
//         item.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//       if (announcementsInMonth.length) {
//         acc[month] = announcementsInMonth;
//       }
//       return acc;
//     },
//     {}
//   );
//   const handleDeleteAnnouncement = async (id) => {
//     try {
//       const response = await axios.delete(`${PORT}deleteAnnouncement/${id}`);
//       toast.success(response.data.msg);
//       fetchAnnouncements();
//     } catch (error) {
//       toast.error("Server Error");
//       console.log(error);
//     }
//   };
//   return (
//     <div>
//       <Layout>
//         <AddBackbtn />
//         <div className="container-fluid py-4">
//           <div className="row">
//             <div className="col-12 col-margin_top">
//               <div className="top-heading-announcement-div">
//                 <div
//                   className="add-announcement-div"
//                   onClick={handleToAddAnnouncement}
//                 >
//                   <button>{language === "hindi" ? "Add +" : "+ जोड़ें"}</button>
//                 </div>

//                 { uniqueMonths.length > 0 ? (
//                   <div className="custom-dropdown">
//                     <select
//                       className="month-select"
//                       value={selectedMonth}
//                       onChange={(e) => setSelectedMonth(e.target.value)}
//                     >
//                       <option value="">Select Month</option>
//                       {uniqueMonths.map((month, index) => (
//                         <option key={index} value={month}>
//                           {month}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 ) : (
//                   ""
//                 )}

//                 <div className="view-announcement-search-filter">
//                   <div className="search_filter_calender_content">
//                     <div className="search-input-wrapper">
//                       <input
//                         type="text"
//                         className="view-announcement-search-input"
//                         placeholder={
//                           language === "english"
//                             ? "नाम से खोजें"
//                             : "Search by name"
//                         }
//                         value={searchQuery}
//                         onChange={handleSearchChange}
//                       />
//                       <RiSearchLine className="search-icon" />
//                     </div>
//                   </div>
//                   <div>
//                   {" "}
//                   <button
//                     className="show-all-button"
//                     // disabled={selectedMonth === "" || searchQuery === ""}
//                     onClick={handleShowAll}
//                   >
//                     Clear
//                   </button>
//                 </div>
//                 </div>

//               </div>

//           <div className="view-announcemnt-main-div">
//                 {loading?<div className="three_circle_loader">
//                           <ThreeCircles
//                             visible={true}
//                             height={100}
//                             width={100}
//                             color="#5e72e4"
//                             ariaLabel="three-circles-loading"
//                           />
//                         </div>: uniqueMonths.length > 0 ? (
//                   <div className="timeline-container">
//                     {Object.keys(filteredAnnouncements).map((month, idx) => (
//                       <div key={idx} className="timeline-item">
//                         <div className="timeline-dot">
//                           <span>{month}</span>
//                           {idx <
//                             Object.keys(filteredAnnouncements).length - 1 && (
//                             <div className="timeline-line"></div>
//                           )}
//                         </div>

//                    {     <div className="announcement-content">
//                           <table className="announcement-table">
//                             <thead className="view-announcement-table-heading">
//                               <tr>
//                                 <th>Title</th>
//                                 <th>Description</th>
//                                 <th>Publish Date</th>
//                                 <th>Action</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {filteredBySearch[month] ? (
//                                 filteredBySearch[month]?.map((item, index) => (
//                                   <tr
//                                     key={index}
//                                     className="view-announcement-content-card"
//                                   >
//                                     <td>{item.title}</td>
//                                     <td className="view-announcement-description-td ">
//                                       {item.description}
//                                     </td>
//                                     <td>
//                                       {moment(item.date, "DD-MM-YYYY").format(
//                                         "DD-MM-YYYY"
//                                       )}
//                                     </td>
//                                     <td className="view-full-details-particular-announcement">
//                                       <button className="edit-btn">
//                                         <FullViewAnnouncement data={item} />
//                                       </button>

//                                       <button
//                                         className="edit-btn"
//                                         onClick={() =>
//                                           handleDeleteAnnouncement(
//                                             item && item._id
//                                           )
//                                         }
//                                       >
//                                         <MdDelete
//                                           data-toggle="tooltip"
//                                           data-placement="top"
//                                           title={
//                                             language === "hindi"
//                                               ? "Click to Delete"
//                                               : "हटाएं"
//                                           }
//                                         />
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr>
//                                   <td colSpan={4}>
//                                     <div className="no_data_entry">No data</div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                         </div>}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="view-announcement-no-data">No Data</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <ToastContainer />
//       </Layout>
//     </div>
//   );
// };

// export default ViewAnnouncement;
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../lib/Layout";
import AddBackbtn from "../../../lib/AddBackbtn";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../../lib/LanguageContext";
import axios from "axios";
import { PORT } from "../../../Api/api";
import moment from "moment";
import { RiSearchLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import FullViewAnnouncement from "../FullViewParticularAnnouncement.js/FullViewAnnouncement";
import { ThreeCircles } from "react-loader-spinner";
import { formatDate } from "../../../lib/FormattedDate";
const ViewAnnouncement = () => {
  const { language } = useContext(LanguageContext);
  const [getAnnouncement, setGetAnnouncement] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleToAddAnnouncement = () => {
    navigate("/admin/addAnnouncement");
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${PORT}getAnnouncement`);
      const filterAnnouncementAccToSociety = response?.data?.data?.filter(
        (item) => item.society_id === society_id
      );

      setGetAnnouncement(filterAnnouncementAccToSociety.reverse());
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Function to group by month and sort in reverse chronological order
  const groupByMonth = (announcements) => {
    const grouped = announcements.reduce((acc, announcement) => {
      const month = moment(announcement.date, "DD-MM-YYYY").format("MMM YYYY");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(announcement);
      return acc;
    }, {});
    return Object.keys(grouped)
      .sort(
        (a, b) =>
          moment(b, "MMM YYYY").toDate() - moment(a, "MMM YYYY").toDate()
      )
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});
  };

  const groupedAnnouncements = groupByMonth(getAnnouncement);
  const filteredAnnouncements =
    selectedMonth && selectedMonth !== "All"
      ? { [selectedMonth]: groupedAnnouncements[selectedMonth] }
      : groupedAnnouncements;
  const uniqueMonths = Object.keys(groupedAnnouncements);
  const handleShowAll = () => {
    setSelectedMonth("");
    setSearchQuery("");
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // Filter announcements based on search query
  const filteredBySearch = Object.keys(filteredAnnouncements).reduce(
    (acc, month) => {
      const announcementsInMonth = filteredAnnouncements[month].filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (announcementsInMonth.length) {
        acc[month] = announcementsInMonth;
      }
      return acc;
    },
    {}
  );
  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await axios.delete(`${PORT}deleteAnnouncement/${id}`);
      toast.success(response.data.msg);
      fetchAnnouncements();
    } catch (error) {
      toast.error("Server Error");
      console.log(error);
    }
  };
  return (
    <div>
      <Layout>
        <div className="container-fluid ">
          <div className="row">
            <div className="col-12">
              <div className="top-heading-announcement-div">
                <div
                  className="add-announcement-div"
                  onClick={handleToAddAnnouncement}
                >
                  <button>{language === "hindi" ? "Add +" : "+ जोड़ें"}</button>
                </div>

                <div className="view-announcement-search-filter">
                  <div className="search_filter_calender_content">
                    <div className="search-input-wrapper">
                      <input
                        type="text"
                        className="view-announcement-search-input"
                        placeholder={
                          language === "english"
                            ? "नाम से खोजें"
                            : "Search by name"
                        }
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      <RiSearchLine className="search-icon" />
                    </div>
                  </div>
                  <div>
                    {" "}
                    <button
                      className="show-all-button"
                      // disabled={selectedMonth === "" || searchQuery === ""}
                      onClick={handleShowAll}
                    >
                      {language === "hindi" ? "Clear" : "साफ़ करें"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="view-announcemnt-main-div">
                <div className="card-body px-0 pt-0 pb-2 w-100 ">
                  <div className="table-responsive p-0 bg-black">
                    {loading ? (
                      <div className="three_circle_loader">
                        <ThreeCircles
                          visible={true}
                          height={100}
                          width={100}
                          color="#5e72e4"
                          ariaLabel="three-circles-loading"
                        />{" "}
                      </div>
                    ) : (
                      <table className="table align-items-center mb-0  ">
                        <thead>
                          <tr>
                            <th className="text-dark text-center text-sm font-weight-bolder opacity-7">
                              {language === "english" ? "शीर्षक" : "Title"}
                            </th>
                            <th className="text-dark text-center text-sm font-weight-bolder opacity-7">
                              {language === "english" ? "विवरण" : "Description"}
                            </th>
                            <th className="text-dark text-center text-sm font-weight-bolder opacity-7">
                              {language === "english"
                                ? "प्रकाशन तिथि"
                                : "Publish Date"}
                            </th>
                            <th className="text-dark text-center text-sm font-weight-bolder opacity-7 ps-2">
                              {language === "english" ? "प्रकार" : "Type"}
                            </th>
                            <th className="text-center text-dark text-sm font-weight-bolder opacity-7">
                              {language === "english" ? "कार्रवाई" : "Action"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {Object.keys(filteredBySearch).length > 0 ? (
                            Object.keys(filteredBySearch).map((month, idx) => (
                              <React.Fragment key={idx}>
                                {filteredBySearch[month].length > 0 ? (
                                  filteredBySearch[month].map((item, index) => (
                                    <tr
                                      key={index}
                                      className="view-announcement-content-card"
                                    >
                                      <td className="text-center align-middle">
                                        {item.title}
                                      </td>
                                      <td className="text-center align-middle">
                                        {item.description.length > 100
                                          ? item.description.substring(0, 40) +
                                            "..."
                                          : item.description}
                                      </td>
                                      <td className="text-center align-middle">
                                        {formatDate(
                                          moment(
                                            item.date,
                                            "DD-MM-YYYY"
                                          ).format("DD-MM-YYYY")
                                        )}
                                      </td>
                                      <td className="text-center align-middle">
                                        {item.category}
                                      </td>
                                      <td className="text-center align-middle d-flex justify-content-center">
                                        <FullViewAnnouncement data={item} />
                                        <button
                                          className="edit-btn"
                                          onClick={() =>
                                            handleDeleteAnnouncement(item._id)
                                          }
                                        >
                                          <MdDelete
                                            title={
                                              language === "hindi"
                                                ? "हटाएं"
                                                : "Click to Delete"
                                            }
                                          />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4}>
                                      <div className="no_data_entry">
                                        No data
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5}>
                                <div className="no_data_entry">No data</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Layout>
    </div>
  );
};

export default ViewAnnouncement;
