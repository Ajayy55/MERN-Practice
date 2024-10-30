import React from "react";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";
import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import AddEntriesPage from "../GuardEntries/AddEntriesPage";
import { useLocation } from "react-router-dom";
import Entry from "../Entry/Entry";
const GuardLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <section>
      <div className="addEntriesPage">
        {location.pathname.startsWith("/login") || <AddEntriesPage />}
      </div>
      {children}
    </section>
  );
};

export default GuardLayout;
