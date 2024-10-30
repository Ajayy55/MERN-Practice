const user = require("../Models/enrtySchema");
exports.editEntry = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedEntry = await user.findById(id);

    if (!updatedEntry) {
      return res.status(404).json({ success: false, msg: "Entry not found" });
    }

    return res
      .status(200)
      .json({ success: true, msg: "Entry updated", details: updatedEntry });
  } catch (error) {
    console.error("Error editing entry:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

const multer = require("multer");
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

exports.updateEntry = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const { titleHindi, titleEnglish, entryType } = req.body;
    const icon = req.file ? req.file.path : null;
    const created_by_edit = req.params.id;

    try {
      const existingEntries = await user.find({
        created_by_edit: created_by_edit,
      });

      if (existingEntries.length === 0) {
        return res.status(404).json({
          error: true,
          msg: "No entries found with the provided created_by_edit id",
        });
      }

      for (let entry of existingEntries) {
        if (icon && entry.icon) {
          fs.removeSync(entry.icon);
        }
        entry.titleHindi = titleHindi || entry.titleHindi;
        entry.titleEnglish = titleEnglish || entry.titleEnglish;
        entry.entryType = entryType || entry.entryType;
        entry.icon = icon || entry.icon;

        await entry.save();
      }

      return res.status(200).json({
        success: true,
        msg: `Entry Updated`,
        details: existingEntries,
      });
    } catch (error) {
      console.error("Error updating entries:", error);
      res.status(500).json({ error: true, msg: "Entries not updated" });
    }
  });
};
//del Entry By Admin
exports.delEntryByAdmin = async (req, res) => {
  let userId = req.params.id;

  try {
    let result = await user.findByIdAndDelete(userId);
    if (result) {
      return res.status(201).json({
        msg: "Data deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    return res.status(401).json({
      msg: "Data not deleted",
    });
  }
};
//delEntry By Super Admin
exports.delEntryBySuperAdmin = async (req, res) => {
  let created_by_edit = req.params.id;

  try {
    let result = await user.deleteMany({ created_by_edit: created_by_edit });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        msg: ` Entry deleted successfully`,
      });
    } else {
      return res.status(404).json({
        msg: "No entries found with the provided created_by_edit id",
      });
    }
  } catch (error) {
    console.error("Error deleting entries:", error);
    return res.status(500).json({
      msg: "An error occurred while deleting entries",
    });
  }
};
