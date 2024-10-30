import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import "./style.css";
import axios from "axios";
import { PORT } from "../Api/api";
import Setting from "../Entry/Setting";
function GuardNav({ language, handleLanguageChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isRegularRoute = location.pathname.includes("/admin/regular/");
  const isEditRegularRoute = location.pathname.includes("/admin/edit-regular/");
  useEffect(() => {
    if (window.location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [location]);

  //setPanelLogo
  const retrievedData = JSON.parse(localStorage.getItem("societyLogo"));
  const logo = retrievedData?.societyLogo;
  const imagePath = logo?.substring(logo.indexOf("public/") + 7);
  const username = retrievedData && retrievedData.username;

  ///getSocityLogo
  const getroleId = JSON.parse(localStorage.getItem("roleId"));
  const [societyLogo, setSocietyLogo] = useState([]);
  const getSocietyData = async () => {
    try {
      const response = await axios.get(`${PORT}/getSocietyData`);
      const res = await response.data.societyData;
      const filterSociety = res.filter((item) => item._id === getroleId);
      setSocietyLogo(filterSociety[0]);
    } catch (error) {
      console.log("Error fetching society data:", error);
    }
  };

  useEffect(() => {
    getSocietyData();
  }, []);
  const logoSociety = societyLogo?.societyLogo?.replace("public/", "");
  return (
    <>
      <div className="nav">
        <div className="profile">
          {location.pathname.startsWith("/login") ||
          location.pathname.startsWith("/admin/") ? null : (
            <Setting />
          )}
        </div>
        <div className="logo">
          <h1 className="m-font">
            {imagePath ? (
              <div className="add_society_logo  ">
                <img src={`/${imagePath}`} alt="" />
              </div>
            ) : (
              <>
                {(() => {
                  if (username) {
                    let words = username.split(" ");
                    const initials = words[0].substring(0, 1).toUpperCase();
                    return (
                      <div className="add_society_logo_profile_Setting">
                        <div className="add_society_logo ">
                          <b>{initials}</b>
                        </div>
                      </div>
                    );
                  } else {
                    return null; 
                  }
                })()}
              </>
            )}
          </h1>

          <div>
         
          </div>
        </div>
        {location.pathname.startsWith("/admin/") ? (
          <></>
        ) : (
          <div className="lang">
            <div>
              {location.pathname.startsWith("/login") ||
              location.pathname.startsWith("/admin/") ? null : (
                <div className="show_society_logo_for_guard">
                  <div className="show_inner_society_logo">
                    {societyLogo ? (
                      <div className="add_society_logo  ">
                        <img src={`/${logoSociety}`} alt="" />
                      </div>
                    ) : (
                      <>
                        {(() => {
                          if (societyLogo) {
                            let words = username.split(" ");
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
                          } else {
                            return null; // Or render a default value or message
                          }
                        })()}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="switch">
              <input
                id="language-toggle"
                checked={language === "hindi"}
                onChange={() => handleLanguageChange()}
                className="check-toggle check-toggle-round-flat"
                type="checkbox"
                disabled={isRegularRoute}
              />
              <label className="lang-cng" htmlFor="language-toggle"></label>
              <span className="on">Hi</span>
              <span className="off">EN</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GuardNav;
