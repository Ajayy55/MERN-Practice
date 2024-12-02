// import React, { useEffect, useState } from 'react'
// import Layout from '../../layout/Layout'
// import { usePermissions } from '../../context/PermissionsContext'
// import { PORT } from '../../port/Port';
// import { jwtDecode } from 'jwt-decode';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// function RegularAttendanceView() {
//     const {hasPermission}=usePermissions();
//     const [RegularEntryList, setRegularEntryList] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1); // Current page state
//     const itemsPerPage = 10; // Items per page
//     const Token=localStorage.getItem('token');
//     const location=useLocation();
//     const entry=location.state;
//     // console.log(entry);  
    

//     const fetchEntry=async(society)=>{
//         try {
//             const url = `${PORT}viewRegularEntryAttendance`;
//             const response = await axios.post(url,{society,regularEntryID:entry._id});
//             console.log(response);
    
//             if (response.status === 200) {
//               setRegularEntryList(response.data.response);
//               setFilteredData(response.data.response); // Initialize filtered data
//             }
//           } catch (error) {
//             console.error("Error fetching house list:", error);
//           }

//     }

// useEffect(()=>{
// if(Token)
// {
//     const decode=jwtDecode(Token);
//     fetchEntry(decode.society||"");
// }


// },[Token])


//     const handleSearchInput = (e) => {
//         const query = e.target.value.toLowerCase();
//         setSearchQuery(query);
    
//         const filtered = RegularEntryList.filter(
//           (user) =>
//             user.name?.toLowerCase().includes(query) ||
//             user.aadhaarNumber?.toLowerCase().includes(query)||
//             user.mobile?.toLowerCase().includes(query)
//         );
//         setFilteredData(filtered);
//       };
    
//       const paginatedEntries = filteredData.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//       );
//       const totalPages = Math.ceil(filteredData.length / itemsPerPage);


//   return (
//     <Layout>
//     <div className="content-wrapper">
//         <div className="col-lg-12 grid-margin stretch-card">
//             <div className="card">
//             {hasPermission("Regular Entries", "Read") ? (
//             <div className="card-body">
//             <div className="card-title d-flex justify-content-between">
           
//                   <input
//                     type="text"
//                     placeholder="Search ..."
//                     onChange={handleSearchInput}
//                     className="form-control"
//                     style={{ width: "30%", marginLeft: "auto" }}
//                   />
//                 </div>
//                 <div className="table-responsive">
//                   <table className="table table-striped">
//                     <thead>
//                       <tr>
//                         <th>Name</th>
//                         <th>Clock In</th>
//                         <th>Clock Out</th>
//                         {/* <th></th> */}
                        
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {paginatedEntries.length > 0 && paginatedEntries.map((entry) => {
//                        return <tr key={entry._id}>
//                           <td className="py-1 text-capitalize">
//                             {/* <img
//                               src={entry?.regularProfileImage ? `${PORT}${entry.regularProfileImage?.split("public")[1]}`:"../../assets/images/faces-clipart/pic-1.png"}
//                               alt="user avatar"
//                               className="me-2"
//                             /> */}
//                             {entry?.regularEntryID.name}
//                           </td>
//                           <td>{entry.clockInTime ? new Date(entry.clockInTime).toLocaleString(
//                                 "en-IN",
//                                 { timeZone: "Asia/Kolkata", month:'short', day:'numeric',year:'numeric', hour:'2-digit', minute:'2-digit'}
//                               ):<span className="px-5" > -</span>}</td>

//                           <td>{entry.clockOutTime ? new Date(entry.clockOutTime).toLocaleString(
//                                 "en-IN",
//                                 { timeZone: "Asia/Kolkata" ,month:'short', day:'numeric',year:'numeric', hour:'2-digit', minute:'2-digit'}
//                               ):<span className="px-3" > -</span>}</td>
//                           {/* <td>{entry.mobile ? entry?.mobile:<span className="px-3" > -</span>}</td> */}
                         
//                         </tr>
//                       })}
//                       {paginatedEntries.length === 0 && RegularEntryList.length === 0 && (
//                         <tr>
//                           <td colSpan="5" className="text-center">
//                             No data available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                   <div className="d-flex justify-content-between align-items-center mt-3">
//                     <span>
//                       Showing {paginatedEntries.length} of{" "}
//                       {filteredData.length} entries
//                     </span>
//                     <nav>
//                       <ul className="pagination">
//                         {[...Array(totalPages)].map((_, index) => (
//                           <li
//                             key={index}
//                             className={`page-item ${
//                               index + 1 === currentPage ? "active" : ""
//                             }`}
//                           >
//                             <button
//                               className="page-link"
//                               onClick={() => setCurrentPage(index + 1)}
//                             >
//                               {index + 1}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     </nav>
//                   </div>
//                 </div>

//             </div>
//                 ): (
//                     <div className="text-danger">
//                       You don't have access to view this page. Unauthorized.
//                     </div>
//                   )}
//                 </div>
//             </div>
//         </div>
   
//     </Layout>
//   )
// }

// export default RegularAttendanceView


import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { usePermissions } from '../../context/PermissionsContext';
import { PORT } from '../../port/Port';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles


const customButtonStyle= {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 11px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "inline-block",
    textAlign: "center",
  }

function RegularAttendanceView() {
  const { hasPermission } = usePermissions();
  const [RegularEntryList, setRegularEntryList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');    
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering
  const [flag,setFlag]=useState(false)
  const itemsPerPage = 10; // Items per page
  const Token = localStorage.getItem('token');
  const location = useLocation();
  const entry = location.state;


  const fetchEntry = async (society) => {
    try {
      const url = `${PORT}viewRegularEntryAttendance`;
      const response = await axios.post(url, { society, regularEntryID: entry._id });
    //   console.log(response);

      if (response.status === 200) {
        setRegularEntryList(response.data.response);
        setFilteredData(response.data.response); // Initialize filtered data
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  useEffect(() => {
    if (Token) {
      const decode = jwtDecode(Token);
      fetchEntry(decode.society || '');
    }
  }, [Token,flag]);

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = RegularEntryList.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.aadhaarNumber?.toLowerCase().includes(query) ||
        user.mobile?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  useEffect(()=>{
    if (startDate && endDate) {
        
        if(!startDate){setStartDate(new Date())}  
        if(!endDate){ setEndDate(new Date())}  
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

      const filtered = RegularEntryList.filter((entry) => {
        const clockInTime = new Date(entry.clockInTime);
        return clockInTime >= startDate && clockInTime <= adjustedEndDate;
      });
      setFilteredData(filtered);
    }
  },[startDate,endDate])

  const paginatedEntries = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            {hasPermission('Regular Entries', 'Read') ? (
              <div className="card-body">
                <div className="card-title d-flex justify-content-between align-items-center">
                  {/* <input
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearchInput}
                    className="form-control"
                    style={{ width: '30%', marginRight: '1rem' }}
                  /> */}
                  <span>
                  </span>
                  {/* Date Pickers */}
                  <div className="d-flex align-items-center gap-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText="Start Date"
                      className="form-control"
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText="End Date"
                      className="form-control"
                    />
                    {/* <button className="btn btn-primary" onClick={handleDateFilter}>
                      Search
                    </button> */}
                    <button className="btn btn-primary" 
                    onClick={()=>{setStartDate(null);setEndDate(null);setFlag((prev)=>!prev)}}
                    style={customButtonStyle}>
                      ClearFilter
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEntries.length > 0 &&
                        paginatedEntries.map((entry) => {
                          return (
                            <tr key={entry._id}>
                              <td className="py-1 text-capitalize">{entry?.regularEntryID?.name}</td>
                              <td>
                               
                                {entry.clockInTime
                                  ?<><i className='mdi mdi-arrow-down-bold me-2 text-success'/> 
                                    { new Date(entry.clockInTime).toLocaleString('en-IN', {
                                      timeZone: 'Asia/Kolkata',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}</> 
                                  : '-'}
                              </td>
                              <td>
                                {entry.clockOutTime
                                  ? 
                                  <><i className='mdi mdi-arrow-up-bold me-2 text-danger'/>
                                  {new Date(entry.clockOutTime).toLocaleString('en-IN', {
                                      timeZone: 'Asia/Kolkata',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}</>
                                  : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      {paginatedEntries.length === 0 && RegularEntryList.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>
                      Showing {paginatedEntries.length} of {filteredData.length} entries
                    </span>
                    <nav>
                      <ul className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-danger">
                You don't have access to view this page. Unauthorized.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RegularAttendanceView;
