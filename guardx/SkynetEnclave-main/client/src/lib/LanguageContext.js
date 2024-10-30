
import React, { createContext, useState, useEffect } from "react";

// Create a LanguageContext
export const LanguageContext = createContext();

// LanguageProvider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "english";
  });
  const handleLanguageChange = () => {
    const newLanguage = language === "english" ? "hindi" : "english";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};
