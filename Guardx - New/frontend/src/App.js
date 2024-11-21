import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Error404 from './pages/errors/Error404';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import LoginProtectedRoutes from './components/ProtectedRoutes/LoginProtectedRoutes';
import SocietyList from './pages/society/SocietyList';
import EditSociety from './pages/society/EditSociety';
import UploadModal from './pages/utils/UploadModal';
import AddSociety from './pages/society/AddSociety';
import UsersList from './pages/users/UsersList';
import { PermissionsProvider, usePermissions } from './context/PermissionsContext';
import RolesList from './pages/roles/RolesList';
import AddRoles from './pages/roles/AddRoles';
import { useEffect } from 'react';
import EditRoles from './pages/roles/EditRoles';
import AddUser from './pages/users/AddUser';
import GuardAccess from './pages/guardAccess/GuardAccess';
import AddSocietyUser from './pages/society/AddSocietyUser';
import EntriesList from './pages/typeOfEntries/EntriesList';
import AddTypesOfEntry from './pages/typeOfEntries/AddTypesOfEntry';
import EditTypesOfEntry from './pages/typeOfEntries/EditTypesOfEntry';
import PurposeList from './pages/purposeOfoccasional/PurposeList';
import AddPurpose from './pages/purposeOfoccasional/AddPurpose';
import EditPurpose from './pages/purposeOfoccasional/EditPurpose';
import Gift from './pages/utils/Gift';
import EditUser from './pages/users/EditUser';
import SimpleTabs from './pages/utils/SimpleTabs';


function App() {


  return (
 <>
     <BrowserRouter>
      <Routes>

      <Route element={<LoginProtectedRoutes/>}>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      </Route>


        {/* <Route path="/" element={<Layout/>}/> */}
        <Route element={<ProtectedRoutes/>}>
        <Route path="/" element={<Dashboard/>}/>

        {/*Society  */}
          <Route path="/society" element={<SocietyList/>}/>
          <Route path="/addsociety" element={<AddSociety/>}/>
          <Route path="/editSociety" element={<EditSociety/>}/>
          <Route path="/addSocietyUser" element={<AddSocietyUser/>}/>
          {/* <Route path="/upload" element={<UploadModal/>}/> */}
    
          {/* users */}
          <Route path="/users" element={<UsersList/>}/>
          <Route path="/addUser" element={<AddUser/>}/>
          <Route path="/editUser" element={<EditUser/>}/>

          {/* Roles */}
          <Route path="/roles" element={<RolesList/>}/>
          <Route path="/addRoles" element={<AddRoles/>}/>
          <Route path="/editRoles" element={<EditRoles/>}/>

          {/* types entries */}
          <Route path="/TypeOfEntries" element={<EntriesList/>}/>
          <Route path="/addTypesOfEntry" element={<AddTypesOfEntry/>}/>
          <Route path="/editTypesOfEntry" element={<EditTypesOfEntry/>}/>

        {/* purpose of occasional */}
        <Route path="/purposeOfOccasional" element={<PurposeList/>}/>
        <Route path="/AddPurposeOfOccasional" element={<AddPurpose/>}/>
        <Route path="/editPurposeOfOccasional" element={<EditPurpose/>}/>


        {/* Guard */}
        <Route path="/GuardAccess" element={<GuardAccess/>}/>
        </Route>
        <Route path="*" element={<Error404/>}/> 
       
      


      </Routes>
    </BrowserRouter>
   
 </>
  );
}

export default App;
