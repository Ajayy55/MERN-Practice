const user = require("../../Models/enrtySchema");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const uploadsDir = "./public/entryCsv";
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
const upload = multer({ storage: storage }).single("entriesCsv");
exports.entriesImportFormCsv = async (req, res) => {
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
      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res.status(400).json({ error: true, msg: "CSV file is empty" });
      }
      const society_id = req.body.society_id;
      const defaultPermissionLevel = req.body.defaultPermissionLevel;
      const updatedJsonArray = jsonArray.map((entry) => ({
        ...entry,
        society_id,
        defaultPermissionLevel,
      }));
      try {
        const existingEntries = await user.find({
          society_id,

          titleEnglish: {
            $in: updatedJsonArray.map((entry) => entry.titleEnglish),
          },
        });
        const existingTitles = existingEntries.map(
          (entry) => entry.titleEnglish
        );
        const existingTitlesSet = new Set(existingTitles);

        const newEntries = updatedJsonArray.filter(
          (entry) => !existingTitlesSet.has(entry.titleEnglish)
        );
        if (newEntries.length > 0) {
          const result = await user.insertMany(newEntries);
          // Update each inserted entry with created_by_edit field
          // for (const entry of result) {
          //   await user.findByIdAndUpdate(
          //     entry._id,
          //     { created_by_edit: entry._id },
          //     { new: true }
          //   );
          // }
          return res.json({
            msg: "Entries added successfully",
            result,
            existingTitles,
          });
          result = await user.findByIdAndUpdate(
            result._id,
            { created_by_edit: result._id },
            { new: true }
          );
        } else {
          return res.status(400).json({
            error: true,
            msg: "Entries already exist",
            existingTitles,
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
const uploadBySuperAdmin = multer({ storage: storage }).single(
  "entriesCsvBySuperAdmin"
);
exports.entriesImportFormCsvBySuperAdmin = async (req, res) => {
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
      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res.status(400).json({ error: true, msg: "CSV file is empty" });
      }
      const society_id = req.body.society_id;
      const defaultPermissionLevel = req.body.defaultPermissionLevel;
      const updatedJsonArray = jsonArray.map((entry) => ({
        ...entry,
        society_id,
        defaultPermissionLevel,
      }));
      try {
        const existingEntries = await user.find({
          society_id,

          titleEnglish: {
            $in: updatedJsonArray.map((entry) => entry.titleEnglish),
          },
        });
        const existingTitles = existingEntries.map(
          (entry) => entry.titleEnglish
        );
        const existingTitlesSet = new Set(existingTitles);

        const newEntries = updatedJsonArray.filter(
          (entry) => !existingTitlesSet.has(entry.titleEnglish)
        );
        if (newEntries.length > 0) {
          const result = await user.insertMany(newEntries);
          // Update each inserted entry with created_by_edit field
          for (const entry of result) {
            await user.findByIdAndUpdate(
              entry._id,
              { created_by_edit: entry._id },
              { new: true }
            );
          }
          return res.json({
            msg: "Entries added successfully",
            result,
            existingTitles,
          });
        } else {
          return res.status(400).json({
            error: true,
            msg: "Entries already exist",
            existingTitles,
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
