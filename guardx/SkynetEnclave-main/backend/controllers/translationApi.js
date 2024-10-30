const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;
const cors = require('cors');

const app = express();
const translate = new Translate();

app.use(cors());
app.use(express.json());

// app.post('/translate', async (req, res) => {
    exports.translationGoogleApi=async(req, res)=>{
        const { text, targetLanguage } = req.body;
        try {
          const [translation] = await translate.translate(text, targetLanguage);
          res.json({ translation });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }

