const express = require('express');
const https = require('https');
const FormData = require('form-data');
const app = express();
app.use(express.json());
const translate = require('google-translate-api');

exports.translate = async (req, res) => {
  const { language, text } = req.body;

  try {
    // Use the Google Translate API to translate the text
    const response = await translate(text, { from: 'en', to: language });
    res.json({ translatedText: response.text });
  } catch (err) {
    console.error('Error while translating:', err);
    res.status(500).json({ error: 'Failed to translate text' });
  }
};
