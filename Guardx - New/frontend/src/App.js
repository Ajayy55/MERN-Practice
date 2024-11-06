import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Error404 from './pages/errors/Error404';

function App() {
  return (
 <>
     <BrowserRouter>
      <Routes>

      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>


        {/* <Route path="/" element={<Layout/>}/> */}
        <Route path="/" element={<Dashboard/>}/>

        <Route path="*" element={<Error404/>}/> 

      </Routes>
    </BrowserRouter>

 </>
  );
}

export default App;
