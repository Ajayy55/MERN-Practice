import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./style.css";
import axios from "axios";
import { PORT } from "../Api/api";
import Setting from "../Entry/Setting";
import LanguageTranslation from "./LanguageTranslation";
import { DataContext } from "../lib/DataContext";
function Navbar({ setCurrentStep }) {
  const navigate = useNavigate();
  const location = useLocation();
  //setPanelLogo
  const {societyDetails}=useContext(DataContext)
  const retrievedData = JSON.parse(localStorage.getItem("societyLogo"));
  const logo = retrievedData?.societyLogo;
  const username = retrievedData && retrievedData.username;
  ///getSocityLogo
  const logoSociety = societyDetails?.societyLogo?.replace("public/", "");
  const navigateFirstPage = () => {
    setCurrentStep(1);
  };
  const navigateVerifiedUser = () => {
    navigate("/");
  };
  return (
    <>
      <div className="nav">
        <div className="profile">
          {location.pathname.startsWith("/login") ||
          location.pathname.startsWith("/admin/") ? null : (
            <Setting />
          )}
        </div>

        <div>
          {location.pathname.startsWith("/login") ? (
            <></>
          ) : location.pathname.startsWith("/verified-user") ? (
            <>
              <div
                onClick={navigateVerifiedUser}
                className="show_society_logo_for_guard "
              >
                <div className="show_inner_society_logo">
                  {societyDetails ? (
                    <div className="add_society_logo  ">
                      <img src={`/${logoSociety}`} alt="" />
                    </div>
                  ) : (
                    <>
                      {(() => {
                        if (societyDetails) {
                          let words = username?.split(" ");
                          const initials = words[0]
                            .substring(0, 1)
                            .toUpperCase();
                          return (
                            <div className="add_society_logo_profile_Setting">
                              <div className="add_society_logo ">
                                <b>{initials}</b>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div
              onClick={navigateFirstPage}
              className="show_society_logo_for_guard "
            >
              <div className="show_inner_society_logo">
                {societyDetails ? (
                  <div className="add_society_logo  ">
                    <img src={`/${logoSociety}`} alt="" />
                  </div>
                ) : (
                  <>
                    {(() => {
                      if (societyDetails) {
                        let words = username?.split(" ");
                        const initials = words[0].substring(0, 1).toUpperCase();
                        return (
                          <div className="add_society_logo_profile_Setting">
                            <div className="add_society_logo ">
                              <b>{initials}</b>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <LanguageTranslation />
      </div>
    </>
  );
}

export default Navbar;
