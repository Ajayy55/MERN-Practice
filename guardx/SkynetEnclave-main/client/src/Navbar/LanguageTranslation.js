import React, { useContext } from "react";
import { LanguageContext } from "../lib/LanguageContext";
const LanguageTranslation = () => {
  const { language, handleLanguageChange } = useContext(LanguageContext);

  return (
    <div>
      <div className="lang">
            <div className="switch">
              <input
                id="language-toggle"
                checked={language === "hindi"}
                onChange={() => handleLanguageChange()}
                className="check-toggle check-toggle-round-flat-dashboard"
                type="checkbox"
              
              />
              <label className="lang-cng" htmlFor="language-toggle"></label>
              <span className="on">HI</span>
              <span className="off">EN</span>
            </div>
          </div>
    </div>
  );
};

export default LanguageTranslation;
