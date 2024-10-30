// export const loadGoogleTranslateScript = () => {
//     return new Promise((resolve, reject) => {
//       if (document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
//         resolve();
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//       script.async = true;
//       script.onload = resolve;
//       script.onerror = reject;
//       document.head.appendChild(script);
//     });
//   };
  
//   export const unloadGoogleTranslateScript = () => {
//     const script = document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]');
//     if (script) {
//       document.head.removeChild(script);
//     }
//     // Remove the translate element if needed
//     const translateElement = document.getElementById('google_translate_element');
//     if (translateElement) {
//       translateElement.innerHTML = '';
//     }
//   };




import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const loadGoogleTranslateScript = () => {
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

export const unloadGoogleTranslateScript = () => {
  const script = document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]');
  if (script) {
    document.head.removeChild(script);
  }
  // Remove the translate element if needed
  const translateElement = document.getElementById('google_translate_element');
  if (translateElement) {
    translateElement.innerHTML = '';
  }
};

const GoogleTranslateManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/photo-verification') {
      unloadGoogleTranslateScript();
    } else {
      loadGoogleTranslateScript();
    }
  }, [location.pathname]);

  return null;
};

export default GoogleTranslateManager;
