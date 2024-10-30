import React from "react";
import { LanguageContext } from "../lib/LanguageContext";
import { useState } from "react";
const LanguageSwitch = () => {
    const [language, setLanguage] = useState("english");
    const handleLanguageChange = () => {
      const newLanguage = language === "english" ? "hindi" : "english";
      setLanguage(newLanguage);
    };
  return (
    <div>
      <div className="lang">
        <div className="switch">
          <input
            id="language-toggle"
            checked={language === "hindi"}
            onChange={() => handleLanguageChange()}
            className="check-toggle check-toggle-round-flat"
            type="checkbox"
       
          />
          <label className="lang-cng" htmlFor="language-toggle"></label>
          <span className="on">Hi</span>
          <span className="off">EN</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitch;
