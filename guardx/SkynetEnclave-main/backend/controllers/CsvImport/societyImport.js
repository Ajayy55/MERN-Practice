const user = require("../../Models/societySchema");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const uploadsDir = "./public/SocietyCsv";
const xlsx = require("xlsx");
fs.ensureDirSync(uploadsDir);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); 
    const newFileName = "icon-" + Date.now() + extension;
    cb(null, newFileName);
  },
});
const upload = multer({ storage: storage }).single("societyCsv");
exports.societyListImportFormCsv = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    } else if (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ error: true, msg: "Internal server error" });
    }

    try {
      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res
          .status(400)
          .json({ error: true, msg: "Excel file is empty" });
      }

      const createdBy = req.body.createdBy;

      // Extract names and contacts from the CSV data
      const names = jsonArray.map((entry) => entry.name);
      const contacts = jsonArray.map((entry) => entry.societyContactNumber);

      // Query the database for existing records
      const existingRecords = await user
        .find({
          $or: [{ name: { $in: names } }, { societyContactNumber: { $in: contacts } }],
        })
        .lean();

      // Create sets for existing names and contacts
      const existingNames = new Set(
        existingRecords.map((record) => record.name)
      );
      const existingContacts = new Set(
        existingRecords.map((record) => record.societyContactNumber)
      );

      // Check for duplicates in the new data
      const uniqueData = [];
      const duplicateMessages = [];
    
   
      jsonArray.forEach((entry) => {
        const isDuplicate =
          existingNames.has(entry.name) ||
          existingContacts.has(entry.societyContactNumber);
        if (isDuplicate) {
          duplicateMessages.push({
            name: entry.name,
            societyContactNumber: entry.societyContactNumber,
        
            societyRegistration: entry.societyRegistration,
       
            societyHouseList: entry.societyHouseList,
        
          });
        } else {
          uniqueData.push({ ...entry, createdBy });
        }
      });
      if (duplicateMessages.length > 0) {
        const duplicateNames = duplicateMessages
          .map(
            (dup) =>
              `Name: ${dup.name}, Contact No: ${dup.societyContactNumber}, Society Registration No: ${dup.societyRegistration},Username:${dup.username}`
          )
          .join("; ");

        return res.status(400).json({
          error: true,
          msg: `Duplicate Society found`,
        });
      }

      // Insert the unique data into the database
      try {
        const result = await user.insertMany(uniqueData);
        return res.json({ msg: "Data added successfully", result });
      } catch (err) {
        console.error("Data insertion error:", err);
        return res
          .status(500)
          .json({ error: true, msg: "Data insertion failed" });
      }
    } catch (err) {
      console.error("File processing error:", err);
      return res
        .status(500)
        .json({ error: true, msg: "File processing failed" });
    }
  });
};
