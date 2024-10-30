// GoogleTranslateContext.js
import React, { createContext, useContext, useEffect } from 'react';

const GoogleTranslateContext = createContext();

export const GoogleTranslateProvider = ({ children }) => {
  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      return new Promise((resolve, reject) => {
        if (document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const unloadGoogleTranslateScript = () => {
      const script = document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]');
      if (script) {
        document.head.removeChild(script);
      }
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.innerHTML = '';
      }
      // Remove any additional Google Translate related elements
      const googleTranslateFrame = document.querySelector('iframe[src*="translate.google.com"]');
      if (googleTranslateFrame) {
        googleTranslateFrame.parentNode.removeChild(googleTranslateFrame);
      }
    };

    const initializeTranslateElement = () => {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi',
              autoDisplay: false,
              gaTrack: true,
            },
            'google_translate_element'
          );
        }
      };
    };

    loadGoogleTranslateScript().then(initializeTranslateElement);

    return () => unloadGoogleTranslateScript();
  }, []);

  return (
    <GoogleTranslateContext.Provider value={{}}>
      {children}
    </GoogleTranslateContext.Provider>
  );
};

export const useGoogleTranslate = () => useContext(GoogleTranslateContext);
