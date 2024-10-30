const user = require("../Models/nonVerfiedPurpose");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const uploadsDir = "./public/PurposeIcon";
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

const upload = multer({ storage: storage }).single("purposeIcon");
exports.nonVerifiedUserPurpose = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const {
      purpose,
      hindiPurpose,
      createdBy,
      society_id,
      defaultPermissionLevel,
      linkedEntry
    } = req.body;
    const purposeIcon = req.file ? req.file.path : "";

    try {
      let result = await user.create({
        purpose,
        hindiPurpose,
        purposeIcon,
        createdBy,
        society_id,
        defaultPermissionLevel,
        linkedEntry
      });
      result = await user.findByIdAndUpdate(
        result._id,
        { created_by_edit: result._id },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        msg: "Purpose added",
        details: result,
      });
    } catch (error) {
      console.error(error);
      res.status(409).json({ error: true, msg: "Purpose not added" });
    }
  });
};
exports.updatePurpose = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const { purpose, hindiPurpose,linkedEntry } = req.body;
    const purposeIcon = req.file ? req.file.path : null;
    const created_by_edit = req.params.id;
    try {
      const existingEntry = await user.find({
        created_by_edit: created_by_edit,
      });
      if (!existingEntry) {
        return res
          .status(404)
          .json({ success: false, msg: "Purpose not found" });
      }
      for (let entry of existingEntry) {
        if (purposeIcon && entry.purposeIcon) {
          fs.removeSync(entry.purposeIcon);
        }

        // Update purpose and hindiPurpose fields
        entry.purpose = purpose || entry.purpose;
        entry.hindiPurpose = hindiPurpose || entry.hindiPurpose;
        entry.linkedEntry=linkedEntry||entry.linkedEntry
        entry.purposeIcon = purposeIcon || entry.purposeIcon;

        // Save updated entry
        await entry.save();
      }
      return res.status(200).json({
        success: true,
        msg: "Purpose updated",
        details: existingEntry,
      });
    } catch (error) {
      console.error("Error updating purpose:", error);
      res.status(500).json({ success: false, msg: "Internal server error" });
    }
  });
};
exports.getUpdatePurpose = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedEntry = await user.findById(id);

    if (!updatedEntry) {
      return res.status(404).json({ success: false, msg: "Entry not found" });
    }

    return res
      .status(200)
      .json({ success: true, msg: "Purpose Data Get", details: updatedEntry });
  } catch (error) {
    console.error("Purpose Data Not Get", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

exports.delPurposeByAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    // Find and delete the purpose data by ID
    const deletedPurpose = await user.findByIdAndDelete(id);
    if (!deletedPurpose) {
      return res.status(404).json({ message: "Purpose data not found" });
    }

    res.json({ message: "Purpose data deleted successfully", deletedPurpose });
  } catch (error) {
    console.error("Error deleting purpose data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//delEntry By Super Admin
exports.delPurposeBySuperAdmin = async (req, res) => {
  let created_by_edit = req.params.id;

  try {
    let result = await user.deleteMany({ created_by_edit: created_by_edit });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        msg: ` Purpose deleted successfully`,
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

