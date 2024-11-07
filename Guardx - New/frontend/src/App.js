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

        </Route>
        <Route path="*" element={<Error404/>}/> 

      </Routes>
    </BrowserRouter>

 </>
  );
}

export default App;
