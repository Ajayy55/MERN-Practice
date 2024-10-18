import { useState } from "react";
import "./App.css";
import Layout from "./layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatisticsCard from "./widgets/cards/StatisticsCard";
import Dashboard from "./pages/dashboard/Dashboard";
import Tables from "./pages/tables/Tables";
import Signup from "./pages/Signup/Signup";
import ProtectedRoutes from "./pages/ProtectectedRoutes/ProtectedRoutes";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login/Login";
import LoginProtectedRoutes from "./pages/ProtectectedRoutes/LoginProtectedRoutes";
import ProfileLayout from "./layouts/ProfileLayout";
import Products from "./pages/Products/Products";
import AddProducts from "./pages/Products/AddProducts";
import UpdateProduct from "./pages/Products/UpdateProduct";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route element={<LoginProtectedRoutes/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup/>} />
          </Route>

          <Route element={<ProtectedRoutes/>}>
             <Route path="/" element={<Layout />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/tables" element={<Tables />} />
             <Route path="/profile" element={<ProfileLayout/>}/>
             <Route path="/products" element={<Products/>}/>
             <Route path="/addProduct" element={<AddProducts/>}/>
             <Route path="/updateProduct" element={<UpdateProduct/>}/>
             

          </Route>
          
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
