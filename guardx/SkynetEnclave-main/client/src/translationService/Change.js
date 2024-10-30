import React, { useEffect, useRef } from "react";
import "./change.css";
import { loadGoogleTranslateScript } from "./utils";
const Change = () => {
  // const googleTranslateRef = useRef(null);

  //  useEffect(() => {
  //    window.googleTranslateElementInit = () => {
  //      if (window.google && window.google.translate) {
  //        new window.google.translate.TranslateElement(
  //          {
  //            pageLanguage: 'en',
  //            includedLanguages: 'en,hi',
  //            autoDisplay: false,
  //            gaTrack: true,
  //          },
  //          googleTranslateRef.current
  //        );
  //      }
  //    };
  //    if (window.google && window.google.translate) {
  //      window.googleTranslateElementInit();
  //    }
  //  }, []);
  useEffect(() => {
    // Load Google Translate script on mount
    loadGoogleTranslateScript().then(() => {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi",
              autoDisplay: false,
              gaTrack: true,
            },
            "google_translate_element"
          );
        }
      };
    });
  });
  return (
    <div>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default Change;
