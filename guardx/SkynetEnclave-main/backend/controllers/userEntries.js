const multer = require("multer");
const user = require("../Models/enrtySchema");
const fs = require("fs-extra");
const path = require("path");

const uploadsDir = "./public/EntryIcon";
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

const upload = multer({ storage: storage }).single("icon");
exports.userEntry = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const icon = req.file ? req.file.path : "";
    try {
      const {
        titleEnglish,
        entryType,
        joiningDate,
        createdBy,
        society_id,
        defaultPermissionLevel,
      } = req.body;
      // Pehle entry ko create karenge
      let result = await user.create({
        titleEnglish,
        icon,
        entryType,
        joiningDate,
        createdBy,
        society_id,
        defaultPermissionLevel,
      });
      result = await user.findByIdAndUpdate(
        result._id,
        { created_by_edit: result._id },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        msg: "Entry added",
        details: result,
      });
    } catch (error) {
      console.error(error);
      res.status(409).json({ error: true, msg: "Entry not added" });
    }
  });
};

exports.addMultiEntries = async (req, res) => {
  try {
    const entries = req.body.entries; // Assume 'entries' is an array of entry objects

    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ error: "Entries must be an array" });
    }

    // Save multiple entries to the database
    const savedEntries = await Entry.insertMany(entries);

    return res
      .status(201)
      .json({ message: "Entries added successfully", details: savedEntries });
  } catch (error) {
    console.error("Error adding entries:", error);
    return res.status(500).json({ error: "Failed to add entries" });
  }
};
