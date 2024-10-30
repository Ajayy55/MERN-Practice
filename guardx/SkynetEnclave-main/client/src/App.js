import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Entry from "./Entry/Entry";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Purpose from "./Purpose/Purpose";
import House from "./Purpose/House";
import Verification from "./PhotoVerify/Verification";
import VerfiedUser from "./Purpose/VerfiedUser";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./GetData/SignUp";
import Login from "./GetData/Login";
import Private from "./Private/Private";
import AdminHome from "./AdminPannel/AdminHome";
import EntryData from "./AdminPannel/EntryData";
import PurposeData from "./AdminPannel/PurposeData";
import HouseData from "./AdminPannel/HouseData";
import MaidData from "./AdminPannel/MaidData";
import AddMaidEntry from "./AdminPannel/AddMaidEntry";
import VerifyEntries from "./AdminPannel/VerifyEntries";
import NotFoundPage from "./Purpose/NotFoundPage";
import Attendance from "./AdminPannel/Attendance";
import SocietyDetails from "./AdminPannel/SocietyDetails";
import AddSociety from "./AdminPannel/AddSociety";
import AddRegularEntries from "./AdminPannel/AddRegularEntries";
import AddHouseDetails from "./AdminPannel/AddHouseDetails";
import EditHouseData from "./AdminPannel/EditHouseData";
import EditHouseMaid from "./AdminPannel/EditHouseMaid";
import PrivateLogout from "./Private/PrivateLogout";
import Dashboard from "./Dashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import Roles from "./Roles/Roles";
import axios from "axios";
import { PORT } from "./Api/api";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import ShowRoles from "./Roles/ShowRoles";
import EditRole from "./Roles/EditRole";
import ShowAdmin from "./AdminCurd/ShowAdmin";
import AddAdmin from "./AdminCurd/AddAdmin";
import EditAdmin from "./AdminCurd/EditAdmin";
import Setting from "./Entry/Setting";
import Profilesetting from "./profileSetting/Profilesetting";
import GuardAttendance from "./profileSetting/GuardAttendance";
import AdminAttendance from "./AdminSetting/AdminAttendance";
import AdminProfileSetting from "./AdminSetting/AdminProfileSetting";
import AdminSetting from "./AdminSetting/AdminSetting";
import SuperAdminSetting from "./AdminSetting/SuperAdminSetting";
import EditEntries from "./AdminPannel/EditEntries";
import EditPurposeData from "./AdminPannel/EditPurposeData";
import AddPurpose from "./AdminPannel/AddPurpose";
import AddEntry from "./AdminPannel/AddEntry";
import Layout from "./Layout";
import EntriesImportCsv from "./AdminPannel/importCsv/EntriesImportCsv";
import { createContext } from "react";
import PurposeImportCsv from "./AdminPannel/importCsv/PurposeImportCsv";
import FirstPage from "./Entry/FirstPage";
import UsersImportCsv from "./AdminPannel/importCsv/UsersImportCsv";
import EditSociety from "./AdminPannel/EditSociety";
import HouseListImportCsv from "./AdminPannel/importCsv/HouseListImportCsv";
import SocietyImportCsv from "./AdminPannel/importCsv/SocietyImportCsv";
import RegularListImportCsv from "./AdminPannel/importCsv/RegularListImportCsv";
import DailyAttendance from "./AdminPannel/attendance/DailyAttendance";
import WeeklyAttendance from "./AdminPannel/attendance/WeeklyAttendance";
import MonthlyAttendance from "./AdminPannel/attendance/MonthlyAttendance";
import ViewAnnouncement from "./AdminPannel/announcement/ViewAnnouncement/ViewAnnouncement";
import AddAnnouncement from "./AdminPannel/announcement/Add Announcement/AddAnnouncement";
import { initializeApp } from "firebase/app";
import { onMessage } from "firebase/messaging";
import {requestPermission,onMessageListener, genToken,messaging} from './firebase/firebase'
import Notification from "./firebase/Notification";
import toast, { Toaster } from 'react-hot-toast';

export const PermissionContext = createContext();

function App() {
  useEffect(()=>{
    // genToken();
    // onMessage(messaging,(payload)=>{
    //   console.log(payload);
    
    // })

    genToken();

    // Set up the message listener
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      
      // Display notification
      const notification = new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon || 'default_icon.png', // Optional icon
      });
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };

  })





  const [permissionData, setPermissionData] = useState([]);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
   
    const getRoleData = async () => {
      try {
        let response = await axios.get(`${PORT}/roleGet`);
        const apiRoles = response.data.roles;
        const localStorageRole = JSON.parse(localStorage.getItem("role"));
        const filteredRoles = apiRoles.filter(
          (item) => item.title === localStorageRole
        );
        setPermissionData(filteredRoles[0]?.permissions || []);
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };
    getRoleData();
  }, []);
  const [language, setLanguage] = useState("english");
  const handleLanguageChange = () => {
    const newLanguage = language === "english" ? "hindi" : "english";
    setLanguage(newLanguage);
  };

  return (
    <>
    <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/layout" element={<Layout language={language} />} />
          <Route path="/" element={<FirstPage language={language} />} />
          <Route path="/purpose" element={<Purpose language={language} />} />

          <Route path="/house-no" element={<House language={language} />} />
          <Route
            path="/photo-verification"
            element={<Verification language={language} />}
          />
          <Route
            path="/verified-user/:id"
            element={<VerfiedUser language={language} />}
          />
          <Route path="/layout" element={<Layout language={language} />} />
          {/* <Route path='/signup' element={<SignUp language={language} />} /> */}

          <Route path="/login" element={<Login language={language} />} />

          <Route path="/admin" element={<Private />}>
            <Route path="home" element={<AdminHome language={language} />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="entry-type"
              element={<EntryData language={language} />}
            />
            <Route
              path="entry-add"
              element={<AddEntry language={language} />}
            />

            <Route
              path="edit-entry/:id"
              element={<EditEntries language={language} />}
            />

            <Route
              path="purpose-type"
              element={<PurposeData language={language} />}
            />
            <Route
              path="purpose-add"
              element={<AddPurpose language={language} />}
            />

            <Route
              path="edit-purpose/:id"
              element={<EditPurposeData language={language} />}
            />

            <Route
              path="house-data"
              element={<HouseData language={language} />}
            />
            <Route
              path="maid-data"
              element={<MaidData language={language} />}
            />
            <Route
              path="add-maid-data"
              element={<AddMaidEntry language={language} />}
            />
            <Route
              path="regular/:id"
              element={<VerifyEntries language={language} />}
            />
            <Route
              path="attendance/:id"
              element={<Attendance language={language} />}
            />
            <Route
              path="society-details"
              element={<SocietyDetails language={language} />}
            />
            <Route
              path="add-society"
              element={<AddSociety language={language} />}
            />
            <Route
              path="edit-society/:id"
              element={<EditSociety language={language} />}
            />
            <Route
              path="add-regular/:id"
              element={<AddRegularEntries language={language} />}
            />
            <Route
              path="edit-regular/:id"
              element={<EditHouseMaid language={language} />}
            />

            <Route
              path="add-house-details"
              element={<AddHouseDetails language={language} />}
            />
            <Route
              path="Edit-house-details/:id"
              element={<EditHouseData language={language} />}
            />
            {/* //Roles Route */}
            <Route
              path="readRoles"
              element={<ShowRoles language={language} />}
            />
            <Route path="addRoles" element={<Roles language={language} />} />
            <Route
              path="editRoles/:id"
              element={<EditRole language={language} />}
            />
            {/* Admin */}
            <Route
              path="showUser"
              element={<ShowAdmin language={language} />}
            />
            <Route path="addUser" element={<AddAdmin language={language} />} />
            <Route
              path="editUser/:id"
              element={<EditAdmin language={language} />}
            />
            {/* //  Setting ROute */}
            <Route
              path="attendance"
              element={<AdminAttendance language={language} />}
            />
            <Route
              path="calender/daily"
              element={<DailyAttendance language={language} />}
            />
            <Route
              path="calender/weekly"
              element={<WeeklyAttendance language={language} />}
            />
            <Route
              path="calender/monthly"
              element={<MonthlyAttendance language={language} />}
            />
            <Route
              path="setting"
              element={<AdminSetting language={language} />}
            />
            <Route
              path="profilesetting"
              element={<AdminProfileSetting language={language} />}
            />
            <Route
              path="importEntries"
              element={<EntriesImportCsv language={language} />}
            />
            <Route
              path="importPurpose"
              element={<PurposeImportCsv language={language} />}
            />
            <Route
              path="importUsers"
              element={<UsersImportCsv language={language} />}
            />
            <Route
              path="importHouseList"
              element={<HouseListImportCsv language={language} />}
            />
            <Route
              path="importSocieties"
              element={<SocietyImportCsv language={language} />}
            />
            <Route
              path="importRegularList"
              element={<RegularListImportCsv language={language} />}
            />
               <Route
            path="viewAnnouncement"
            element={<ViewAnnouncement language={language} />}
          />
               <Route
            path="addAnnouncement"
            element={<AddAnnouncement language={language} />}
          />
          </Route>
          {/* Guard Setting Routes */}
          <Route
            path="/profileSetting"
            element={<Profilesetting language={language} />}
          />
          <Route
            path="/showAttendance"
            element={<GuardAttendance language={language} />}
          />
         
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
// Component to handle redirection
const AdminRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [location, navigate]);

  return null; // Or you can return a loading spinner or something else if necessary
};

export default App;
