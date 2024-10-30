const user = require("../../Models/verifiedUserSchema");
const fs = require('fs-extra');
const path = require('path');
const multer = require("multer");
const uploadsDir = './public/regularEntiresCsv';
const csv = require("csvtojson");
fs.ensureDirSync(uploadsDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname); 
        const newFileName = 'icon-' + Date.now() + extension; 
        cb(null, newFileName);
    },
});
const upload = multer({ storage: storage }).single('regularCsv'); 

exports.regularEntriesImportFormCsv = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: true, msg: 'File upload failed' });
        } else if (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: true, msg: 'Internal server error' });
        }
        try {
            const filePath = await path.join(uploadsDir, req.file.filename);
            const jsonArray = await csv().fromFile(filePath);

            // Check if the CSV is empty
            if (jsonArray.length === 0 || jsonArray.every(row => Object.values(row).every(cell => cell === ''))) {
                return res.status(400).json({ error: true, msg: "CSV file is empty" });
            }

            const paramsId = req.body.paramsId;

            // Check for existing aadharNumbers in the database
            const aadharNumbers = jsonArray.map(entry => entry.aadharNumber);
            const existingUsers = await user.find({ aadharNumber: { $in: aadharNumbers } });

            if (existingUsers.length > 0) {
                const existingAadharNumbers = existingUsers.map(user => user.aadharNumber);
                return res.status(400).json({ 
                    error: true, 
                    msg: `The following Aadhar Numbers already exist: ${existingAadharNumbers.join(', ')}`
                });
            }

            const updatedJsonArray = jsonArray.map(entry => ({ ...entry, paramsId }));

            try {
                const result = await user.insertMany(updatedJsonArray);
                return res.json({ msg: "Data added successfully", result });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: true, msg: "Data insertion failed" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: true, msg: "CSV processing failed" });
        }
    });
};
