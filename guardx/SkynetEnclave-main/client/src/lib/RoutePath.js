import { MdDashboard } from "react-icons/md";
import { GrDocumentVerified } from "react-icons/gr";
import { IoGitPullRequestOutline } from "react-icons/io5";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaHouseUser } from "react-icons/fa";
import { MdPermIdentity } from "react-icons/md";
import { BsDiagram2Fill } from "react-icons/bs";
import { FaFingerprint } from "react-icons/fa";
import { FaFileImport } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";

import { LanguageContext } from "./LanguageContext";
import { useContext } from "react";
import { FaRegBell } from "react-icons/fa";
const NavConfig = () => {
  const { language } = useContext(LanguageContext);
  const titles = {
    hindi: {
      dashboard: "Dashboard",
      regularEntries: "Regular Entries",
      guestEntriesRequests: "Guest Entries Requests",
      typeOfEntries: "Type of Entries",
      purposeOfOccasional: "Purpose of Occasional",
      houseList: "House List",
      user: "User",
      roles: "Roles",
      societyDetails: "Society Details",
      attendance: "Attendance",
      importEntries: "Import Entries",
      importPurpose: "Import Purpose",
      profilesetting: "Profile Setting",
      importUsers: "Import Users",
      importHouseList: "Import House List",
      importSocieties: "Import Societies",
      importRegularList: "Import Regular Entries",
      calenderDaily:"Daily Attendance",
      calenderWeekly:"Weekly Attendance",
      calenderMonthly:"Monthly Attendance",
      viewAnnouncement:"Announcement"
    },
    english: {
      dashboard: "डैशबोर्ड",
      regularEntries: "नियमित प्रविष्टियाँ",
      guestEntriesRequests: "अतिथि प्रविष्टि अनुरोध",
      typeOfEntries: "प्रविष्टियों के प्रकार",
      purposeOfOccasional: "आवधिक उद्देश्य",
      houseList: "घर की सूची",
      user: "उपयोगकर्ता",
      roles: "भूमिकाएँ",
      societyDetails: "सोसाइटी विवरण",
      attendance: "उपस्थिति",
      importEntries: "प्रविष्टियाँ आयात करें",
      importPurpose: "उद्देश्य आयात करें",
      profilesetting: "प्रोफ़ाइल सेटिंग",
      importUsers: "उपयोगकर्ताओं को आयात करना ",
      importHouseList: "हाउस सूची आयात करें",
      importSocieties: "सामाजिकता आयात करें",
      importRegularList: "नियमित प्रविष्टियाँ आयात करें",
      calenderDaily:"दैनिक उपस्थिति",
      calenderWeekly:"साप्ताहिक उपस्थिति",
      calenderMonthly:"मासिक उपस्थिति",
      viewAnnouncement:"घोषणा"
    },
  };

  //path
  const navConfig = [
    {
      path: "/admin/dashboard",
      title: titles[language].dashboard,
      icon: MdDashboard,
    },
    //Regular Entries Routes
    {
      path: "/admin/regular/:id",
      title: titles[language].regularEntries,
      icon: GrDocumentVerified,
    },
    {
      path: "/admin/add-regular/:id",
      title: titles[language].regularEntries,
      icon: GrDocumentVerified,
    },
    {
      path: "/admin/edit-regular/:id",
      title: titles[language].regularEntries,
      icon: GrDocumentVerified,
    },

    {
      path: "/admin/home",
      title: titles[language].guestEntriesRequests,
      icon: IoGitPullRequestOutline,
    },
    //Entry Type
    {
      path: "/admin/entry-type",
      title: titles[language].typeOfEntries,
      icon: FaLocationArrow,
    },
    {
      path: "/admin/entry-add",
      title: titles[language].typeOfEntries,
      icon: FaLocationArrow,
    },
    {
      path: "/admin/edit-entry/:id",
      title: titles[language].typeOfEntries,
      icon: FaLocationArrow,
    },

    //Purpose of Occasional
    {
      path: "/admin/purpose-type",
      title: titles[language].purposeOfOccasional,
      icon: AiOutlineQuestionCircle,
    },
    {
      path: "/admin/purpose-add",
      title: titles[language].purposeOfOccasional,
      icon: AiOutlineQuestionCircle,
    },
    {
      path: "/admin/edit-purpose/:id",
      title: titles[language].purposeOfOccasional,
      icon: AiOutlineQuestionCircle,
    },
    //House List
    {
      path: "/admin/house-data",
      title: titles[language].houseList,
      icon: FaHouseUser,
    },
    {
      path: "/admin/add-house-details",
      title: titles[language].houseList,
      icon: FaHouseUser,
    },
    {
      path: "/admin/Edit-house-details/:id",
      title: titles[language].houseList,
      icon: FaHouseUser,
    },
    //User
    {
      path: "/admin/showUser",
      title: titles[language].user,
      icon: MdPermIdentity,
    },
    {
      path: "/admin/addUser",
      title: titles[language].user,
      icon: MdPermIdentity,
    },
    {
      path: "/admin/editUser/:id",
      title: titles[language].user,
      icon: MdPermIdentity,
    },
    //Roles
    {
      path: "/admin/readRoles",
      title: titles[language].roles,
      icon: BsDiagram2Fill,
    },
    {
      path: "/admin/addRoles",
      title: titles[language].roles,
      icon: BsDiagram2Fill,
    },
    {
      path: "/admin/editRoles/:id",
      title: titles[language].roles,
      icon: BsDiagram2Fill,
    },
    // Society
    {
      path: "/admin/society-details",
      title: titles[language].societyDetails,
      icon: FaHouseUser,
    },
    {
      path: "/admin/add-society",
      title: titles[language].societyDetails,
      icon: FaHouseUser,
    },
    {
      path: "/admin/edit-society/:id",
      title: titles[language].societyDetails,
      icon: FaHouseUser,
    },

    //  Attendance
    {
      path: "/admin/attendance/:id",
      title: titles[language].attendance,
      icon: FaFingerprint,
    },
    //Import Entries
    {
      path: "/admin/importEntries",
      title: titles[language].importEntries,
      icon: FaFileImport,
    },
    {
      path: "/admin/importPurpose",
      title: titles[language].importPurpose,
      icon: FaFileImport,
    },
    {
      path: "/admin/profilesetting",
      title: titles[language].profilesetting,
      icon: IoSettings,
    },
    {
      path: "/admin/importUsers",
      title: titles[language].importUsers,
      icon: FaFileImport,
    },
    {
      path: "/admin/importHouseList",
      title: titles[language].importHouseList,
      icon: FaFileImport,
    },
    {
      path: "/admin/importSocieties",
      title: titles[language].importSocieties,
      icon: FaFileImport,
    },
    {
      path: "/admin/importRegularList",
      title: titles[language].importRegularList,
      icon: FaFileImport,
    },
    {
      path: "/admin/calender/daily",
      title: titles[language].calenderDaily,
      icon: FaFileImport,
    },
    {
      path: "/admin/calender/weekly",
      title: titles[language].calenderWeekly,
      icon: FaFileImport,
    },
    {
      path: "/admin/calender/monthly",
      title: titles[language].calenderMonthly,
      icon: FaFileImport,
    },
    {
      path: "/admin/viewAnnouncement",
      title: titles[language].viewAnnouncement,
      icon: FaRegBell,
    },
    {
      path: "/admin/addAnnouncement",
      title: titles[language].viewAnnouncement,
      icon: FaRegBell,
    },
   
  ];
  return navConfig;
};
export default NavConfig;
