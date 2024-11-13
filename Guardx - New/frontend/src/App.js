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
          {/* <Route path="/upload" element={<UploadModal/>}/> */}

          {/* users */}
          <Route path="/users" element={<UsersList/>}/>

          {/* Roles */}
          <Route path="/roles" element={<RolesList/>}/>
          <Route path="/addRoles" element={<AddRoles/>}/>


        </Route>
        <Route path="*" element={<Error404/>}/> 

      </Routes>
    </BrowserRouter>
   
 </>
  );
}

export default App;
