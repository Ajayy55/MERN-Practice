import React, { useEffect, useState, useRef } from 'react';
import { PORT } from '../../port/Port';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2/dist/sweetalert2.js";


function SideNav({ isOpen}) {
// function SideNav() {
const [permissions,Setpermissions]=useState([])
const [permissionLevel,SetpermissionLevel]=useState(null)
const [TokenExp, SetTokenExp] = useState(false);
const [token, setToken] = useState(null);
const [user,setUser]=useState({name:'',role:''})
const intervalRef = useRef(null); // Ref to store the interval ID
const [SocietyEntriesData, setSocietyEntriesData] = useState([]);
const tkn = localStorage.getItem("token");
const decode = jwtDecode(tkn);
// const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
let userID;
let societyId;
const [isCollapsed, setIsCollapsed] = useState(false);
const [flag,setFlag]=useState(true)
const sessionString=localStorage.getItem('sessionString')

const toggleCollapse = () => {
  setIsCollapsed((prevState) => !prevState);
};


const navigate =useNavigate()
  useEffect(() => {
    

    if (tkn) {
      // const decode = jwtDecode(storedToken);
      setToken(tkn);
      
      userID = decode.id;
      
      // Check if the token has expired initially
      if (decode.exp < Math.round(Date.now() / 1000)) {
        handleSessionExpired();
      } else {
        // Set up the interval only once
        intervalRef.current = setInterval(() => {
          if (decode.exp < Math.round(Date.now() / 1000)) {
            handleSessionExpired();
          }
        }, 5000); // Check every 5 seconds
      }
    }


    const getPermissions=async()=>{
      try {
        if(userID){
          const url=`${PORT}getPemissions`
          const response=await axios.post(url,{id:userID})  //super
          // console.log('permssions',response);
          
          setUser({name:response?.data?.name,role:response?.data?.role?.title,society:response?.data?.society?.name||"",societyLogo:response?.data?.society?.societyLogo||""})
          Setpermissions(response?.data.role?.permissions)
          SetpermissionLevel(response?.data?.permissionLevel)
        }
      } catch (error) {
       console.log('At fetching permissions',error);
      }
    }
  
  // console.log(user)

    getPermissions();

    return () => {
      // Clear the interval when component unmounts
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [token]);

  const memberSession=async(memberId)=>{
    // console.log(sessionString);
    
     try {
       const url=`${PORT}memberSession`;
       const response=await axios.post(url,{memberId,login:false,sessionString})
       console.log('dsdsd',response);
       localStorage.setItem('sessionString',response.data.session)
     } catch (error) {
       console.log(error);
       
     }
   }

const handleSessionExpired = async() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    Swal.fire({
      position: "center",
      icon: "error",
      title: 'Session Expired',
      showConfirmButton: false,
      timer: 1500
    });
    await memberSession(localStorage.getItem('user'))
    navigate("/login");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
  };


  const hasPermission = (moduleName, action) =>
    permissions?.find(
      (perm) => perm.moduleName === moduleName && perm.actions.includes(action)
    );


    const fetchSocietyTypeOfEntries=async()=>{
      try {
          // const id='6731880e33cc6e06c07b10eb'
          if(decode?.society){
            const response=await axios.get(`${PORT}getTypesOfEntriesOfSociety/${decode?.society}`)
            // console.log('res',response);
            
            const societyRegularEntries = response?.data?.response.typeOfEntries.filter((entry)=>entry.entryType==='regular') ||null;
           
            
            setSocietyEntriesData(societyRegularEntries);
          }
         
      } catch (error) {
        console.log(error);
      }
    }
 
  useEffect(()=>{
    // console.log('inside');
    
    fetchSocietyTypeOfEntries();
  },[flag])
  // console.log('ss',SocietyEntriesData,decode);
// console.log('pp',permissions,permissionLevel);

const handleNavigate=(entry)=>{
  // console.log('entry',entry);
  
  navigate(`/regularentries`, {state:{_id:entry._id,title:entry.title}});
}


  return (
    <>
    
    {/* <nav className={`sidebar sidebar-offcanvas `} > */}
    <nav className={`sidebar sidebar-offcanvas ${isOpen ? "" : ""}`} id="sidebar"  style={{
         transform: !isOpen ? "translateX(-100%)" : "", // Slide in/out
        transition: "transform 0.3s ease-in-out", // Smooth animation 
      }}>
  <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
    <NavLink to='/' className="sidebar-brand brand-logo" >
      {/* <img src="assets/images/logo.svg" alt="logo" /> */}
      <img src="./guardx.png" alt="logo" />
      {/* <img src="./guardxlogo.webp" alt="logo" style={{width:'120px', height:'80px',borderRadius:'90%'}}/> */}
    </NavLink>
    <a className="sidebar-brand brand-logo-mini" href="">
      <img src="assets/images/logo-mini.svg" alt="logo" />
    </a>
  </div>
  <ul className="nav">
    <li className="nav-item profile">
      <div className="profile-desc">
        <div className="profile-pic">
          <div className="count-indicator">
           
            <img
              className="img-xs rounded-circle "
              src={user?.societyLogo ? `${PORT}${user?.societyLogo.split('public')[1]}`:"assets/images/faces/face15.jpg"}
              alt=""
            />
            <span className="count bg-success" />
          </div>
          <div className="profile-name">
            <h5 className="mb-0 font-weight-normal text-capitalize">{user?.society ? user?.society :user?.name }</h5>
            <span>{user?.role}</span>
          </div>
        </div>
        <hr />
        {/* <a href="#" id="profile-dropdown" data-bs-toggle="dropdown">
          <i className="mdi mdi-dots-vertical" />
        </a>
        <div
          className="dropdown-menu dropdown-menu-right sidebar-dropdown preview-list"
          aria-labelledby="profile-dropdown"
        >
          <a href="#" className="dropdown-item preview-item">
            <div className="preview-thumbnail">
              <div className="preview-icon bg-dark rounded-circle">
                <i className="mdi mdi-cog text-primary" />
              </div>
            </div>
            <div className="preview-item-content">
              <p className="preview-subject ellipsis mb-1 text-small">
                Account settings
              </p>
            </div>
          </a>
          <div className="dropdown-divider" />
          <a href="#" className="dropdown-item preview-item">
            <div className="preview-thumbnail">
              <div className="preview-icon bg-dark rounded-circle">
                <i className="mdi mdi-onepassword  text-info" />
              </div>
            </div>
            <div className="preview-item-content">
              <p className="preview-subject ellipsis mb-1 text-small">
                Change Password
              </p>
            </div>
          </a>
          <div className="dropdown-divider" />
          <a href="#" className="dropdown-item preview-item">
            <div className="preview-thumbnail">
              <div className="preview-icon bg-dark rounded-circle">
                <i className="mdi mdi-calendar-today text-success" />
              </div>
            </div>
            <div className="preview-item-content">
              <p className="preview-subject ellipsis mb-1 text-small">
                To-do list
              </p>
            </div>
          </a>
        </div> */}
      </div>
    </li>

    <li className="nav-item nav-category">
        <div className="" style={{  height: '0',
    margin: '0',
    overflow: 'hidden',
    borderTop: '1px solid grey',
    opacity: '1',}}/>
    </li>
 
{/* Dashboard */}
    {permissionLevel && permissionLevel <= 4 ?<>
    <li className="nav-item menu-items">
    <NavLink to='/dashboard' className="nav-link">
        <span className="menu-icon">
          <i className="mdi mdi-speedometer" />
        </span>
        <span className="menu-title">Dashboard</span>
      </NavLink>
    </li></> :null
    }

    {/* Society */}
    {hasPermission('Society List', 'Module') && (
            <li className="nav-item menu-items">
              <NavLink to='/society' className="nav-link" >
                <span className="menu-icon">
                  <i className="mdi mdi-table-large" />
                </span>
                <span className="menu-title">Society</span>
                <i className="menu-arrow" />
              </NavLink>
            </li>
          )}

    {/* Regular Entries */}
    {hasPermission('Regular Entries', 'Module') && (
            <li className="nav-item menu-items">
              <span onClick={() => setFlag((prev) => !prev)}
                className="nav-link"
                data-bs-toggle="collapse"
                href="#ui-basic"
                aria-expanded="true"
                aria-controls="ui-basic"
              >
                <span className="menu-icon">
                  <i className="mdi mdi-laptop" />
                </span>
                <span className="menu-title" >Regular Entries</span>
                <i className="menu-arrow" />
              </span>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  
                  {
                    SocietyEntriesData.length>0 ? ( SocietyEntriesData.map((entry)=>{
                      return <li className="nav-item" key={entry._id}>
                      <span className="nav-link text-capitalize" href="pages/ui-features/buttons.html" onClick={()=>{handleNavigate(entry)}} style={{cursor:'pointer'}}>
                       {entry?.title}
                      </span>
                    </li> 

                    })):( <span className="nav-link text-capitalize" href="pages/ui-features/buttons.html" onClick={()=>{handleNavigate("entry")}} style={{cursor:'pointer'}}>
                    {"Add Type of Entries"}
                   </span>)

                  }
                <li className="nav-item" ></li>
             
                </ul>
              </div>
            </li>
          )}

{/* Guest List */}

{/* {hasPermission('Guest Entries', 'Module') && (
            <li className="nav-item menu-items">
              <a className="nav-link" href="pages/forms/basic_elements.html">
                <span className="menu-icon">
                  <i className="mdi mdi-contacts" />
                </span>
                <span className="menu-title">Guest Entries</span>
                <i className="menu-arrow" />
              </a>
            </li>
          )} */}



{/* Occasional purpose */}
{hasPermission('Purpose of Occasional', 'Module') && (
    <li className="nav-item menu-items">
      <NavLink to='/purposeOfOccasional' className="nav-link" href="pages/charts/chartjs.html">
        <span className="menu-icon">
          <i className="mdi mdi-chart-bar" />
        </span>
        <span className="menu-title"> Occasional Purposes</span>
        <i className="menu-arrow" />
      </NavLink>
    </li>)
     }

     {/* Types of entires */}
{hasPermission('Type of Entries', 'Module') && (
            <li className="nav-item menu-items">
              <NavLink to='/TypeOfEntries' className="nav-link" href="pages/tables/basic-table.html">
                <span className="menu-icon">
                  <i className="mdi mdi-format-list-bulleted" />
                </span>
                <span className="menu-title">Type of Entries</span>
                <i className="menu-arrow" />
              </NavLink>
            </li>
          )}

{/* House List */}
{hasPermission('House List', 'Module') && (
           <li className="nav-item menu-items">
           <NavLink to='/houseList' className="nav-link" href="pages/charts/chartjs.html">
             <span className="menu-icon">
               <i className="mdi mdi-home" />
             </span>
             <span className="menu-title">House List</span>
             <i className="menu-arrow" />
           </NavLink>
         </li>
          )}



{/* Attendance*/}
{/* {hasPermission('Attendance', 'Module') && (
    <li className="nav-item menu-items">
      <a className="nav-link" href="pages/charts/chartjs.html">
        <span className="menu-icon">
          <i className="mdi mdi-fingerprint" />
        </span>
        <span className="menu-title">Attendance</span>
        <i className="menu-arrow" />
      </a>
    </li>)
     } */}

    {/* Annoucmnets */}
    {/* {hasPermission('Announcements', 'Module') && (
    <li className="nav-item menu-items">
      <a className="nav-link" href="pages/charts/chartjs.html">
        <span className="menu-icon">
          <i className="mdi mdi-newspaper" />
        </span>
        <span className="menu-title">Announcements</span>
        <i className="menu-arrow" />
      </a>
    </li>)
     } */}

     {/* Complaints */}
     {/* {hasPermission('Complaints', 'Module') && (
    <li className="nav-item menu-items">
      <a className="nav-link" href="pages/icons/font-awesome.html">
        <span className="menu-icon">
          <i className="mdi mdi-clipboard-text" />
        </span>
        <span className="menu-title">Complaints</span>
        <i className="menu-arrow" />
      </a>
    </li>)
     } */}

{/* Users */}
{hasPermission('Users', 'Module') && (
    <li className="nav-item menu-items">
        <NavLink to='/users'className="nav-link" href="pages/icons/font-awesome.html">
        <span className="menu-icon">
          <i className="mdi mdi-account" />
        </span>
        <span className="menu-title">Users</span>
        <i className="menu-arrow" />
      </NavLink>
    </li>)
     }

{/* Admin */}
{hasPermission('Roles', 'Module') && (
    <li className="nav-item menu-items">
       <NavLink to='/roles' className="nav-link" href="pages/icons/font-awesome.html">
        <span className="menu-icon">
          <i className="mdi mdi-security" />
        </span>
        <span className="menu-title">Roles</span>
        <i className="menu-arrow" />
      </NavLink>
    </li>)
     }
  </ul>
</nav>


    </>
  )
}

export default SideNav



 {/* <li className="nav-item menu-items">
      <a
        className="nav-link"
        data-bs-toggle="collapse"
        href="#auth"
        aria-expanded="false"
        aria-controls="auth"
      >
        <span className="menu-icon">
          <i className="mdi mdi-security" />
        </span>
        <span className="menu-title">User Pages</span>
        <i className="menu-arrow" />
      </a>
      <div className="collapse" id="auth">
        <ul className="nav flex-column sub-menu">
          <li className="nav-item">
            {" "}
            <a className="nav-link" href="pages/samples/login.html">
              {" "}
              Login{" "}
            </a>
          </li>
          <li className="nav-item">
            {" "}
            <a className="nav-link" href="pages/samples/register.html">
              {" "}
              Register{" "}
            </a>
          </li>
          <li className="nav-item">
            {" "}
            <a className="nav-link" href="pages/samples/error-404.html">
              {" "}
              404{" "}
            </a>
          </li>
          <li className="nav-item">
            {" "}
            <a className="nav-link" href="pages/samples/error-500.html">
              {" "}
              505{" "}
            </a>
          </li>
          <li className="nav-item">
            {" "}
            <a className="nav-link" href="pages/samples/blank-page.html">
              {" "}
              Blank Page{" "}
            </a>
          </li>
        </ul>
      </div>
    </li> */}