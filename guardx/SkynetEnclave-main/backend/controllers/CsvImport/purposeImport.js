const user = require("../../Models/nonVerfiedPurpose");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const uploadsDir = "./public/purposeCsv";
const csv = require("csvtojson");
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
const upload = multer({ storage: storage }).single("purposeCsv");
exports.purposeImportFormCsv = async (req, res) => {
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
      const filePath = await path.join(uploadsDir, req.file.filename);
      const jsonArray = await csv().fromFile(filePath);

      // Check if the CSV contains only headers and no data
      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res.status(400).json({ error: true, msg: "CSV file is empty" });
      }

      // Add parentId to each entry
      const society_id = req.body.society_id;
      const defaultPermissionLevel = req.body.defaultPermissionLevel ; 
      const updatedJsonArray = jsonArray.map((entry) => ({
        ...entry,
        society_id,
        defaultPermissionLevel
      }));
      try {

        const existingPurpose = await user.find({
          society_id,
          purpose: {
            $in: updatedJsonArray.map((entry) => entry.purpose),
          },
        });
        const existingPurposeTitles = existingPurpose.map(
          (entry) => entry.purpose
        );

        const purposeTitlesSet = new Set(existingPurposeTitles); 
        const newEntries = updatedJsonArray.filter(
          (entry) => !purposeTitlesSet.has(entry.purpose)
        );
        if (newEntries.length > 0) {
          const result = await user.insertMany(newEntries);

          return res.json({
            msg: "Purposes added successfully",
            result,
            existingPurposeTitles,
          });
        } else {
          return res
            .status(400)
            .json({
              error: true,
              msg: "Purposes already exist",
              existingPurposeTitles,
            });
        }
     
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: true, msg: "Data insertion failed" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: true, msg: "CSV processing failed" });
    }
  });
};
const uploadBySuperAdmin = multer({ storage: storage }).single("purposeCsvBySuperAdmin");
exports.purposeImportFormCsvBySuperAdmin = async (req, res) => {
  uploadBySuperAdmin(req, res, async function (err) {
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
      const filePath = await path.join(uploadsDir, req.file.filename);
      const jsonArray = await csv().fromFile(filePath);

      // Check if the CSV contains only headers and no data
      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res.status(400).json({ error: true, msg: "CSV file is empty" });
      }

      // Add parentId to each entry
      const society_id = req.body.society_id;
      const defaultPermissionLevel = req.body.defaultPermissionLevel ; 
      const updatedJsonArray = jsonArray.map((entry) => ({
        ...entry,
        society_id,
        defaultPermissionLevel
      }));
      try {

        const existingPurpose = await user.find({
          society_id,
          purpose: {
            $in: updatedJsonArray.map((entry) => entry.purpose),
          },
        });
        const existingPurposeTitles = existingPurpose.map(
          (entry) => entry.purpose
        );

        const purposeTitlesSet = new Set(existingPurposeTitles); 
        const newEntries = updatedJsonArray.filter(
          (entry) => !purposeTitlesSet.has(entry.purpose)
        );
        if (newEntries.length > 0) {
          const result = await user.insertMany(newEntries);
          for (const entry of result) {
            await user.findByIdAndUpdate(
              entry._id,
              { created_by_edit: entry._id },
              { new: true }
            );
          }
          return res.json({
            msg: "Purposes added successfully",
            result,
            existingPurposeTitles,
          });
        } else {
          return res
            .status(400)
            .json({
              error: true,
              msg: "Purposes already exist",
              existingPurposeTitles,
            });
        }
     
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: true, msg: "Data insertion failed" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: true, msg: "CSV processing failed" });
    }
  });
};
