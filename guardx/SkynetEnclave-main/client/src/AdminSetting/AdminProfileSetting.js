import React, { useContext, useState } from "react";
import Layout from "../lib/Layout";
import EditPersonalDetails from "./EditTabingView/EditPersonalDetails";
import "./adminsetting.css";
import EditSocietyDetails from "./EditTabingView/EditSocietyDetails";
import { LanguageContext } from "../lib/LanguageContext";
const AdminProfileSetting = () => {
  const [activeComponent, setActiveComponent] = useState("personal");
  const { language } = useContext(LanguageContext);
  const role_level = JSON.parse(localStorage.getItem("role")) || null;
  console.log(role_level,"rolelevel")
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };
  return (
    <Layout>
      <div className="container-fluid  py-4 w-100">
        <div className="row ">
          <div className="col-12  col-margin_top">
            <div className="card mb-4">
              <div className="card-header pb-0">
                <div className="button-container-personal-section">
                  <button
                    className={`tab-button ${
                      activeComponent === "personal" ? "activePersoanl" : ""
                    }`}
                    onClick={() => setActiveComponent("personal")}
                  >
                    {language === "hindi"
                      ? " Personal details"
                      : "व्यक्तिगत विवरण"}
                  </button>
                  {(role_level === 1||role_level === 5||role_level === 2 )? (
                    ""
                  ) : (
                    <button
                      className={`tab-button ${
                        activeComponent === "society" ? "activePersoanl" : ""
                      }`}
                      onClick={() => setActiveComponent("society")}
                    >
                      {language === "hindi"
                        ? "Society details "
                        : "सोसायटी विवरण"}
                    </button>
                  )}
                </div>

                <div className="component-display">
                  {activeComponent === "personal" && <EditPersonalDetails />}
                  {activeComponent === "society" && <EditSocietyDetails />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfileSetting;
