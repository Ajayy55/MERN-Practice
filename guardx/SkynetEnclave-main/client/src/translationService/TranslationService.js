import axios from 'axios';

const API_KEY = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Replace with your Google Translate API key
const TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(TRANSLATE_URL, {}, {
      params: {
        q: text,
        target: targetLanguage,
        key: API_KEY
      }
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text in case of error
  }
};

export default translateText;