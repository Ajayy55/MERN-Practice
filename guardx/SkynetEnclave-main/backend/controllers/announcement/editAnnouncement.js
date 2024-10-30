const announcementSchema = require("../../Models/announcementSchema");
const multer = require("multer");
const path = require("path");
// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const uploadFields = upload.fields([{ name: "images", maxCount: 10 }]);

exports.editAnnouncement = (req, res) => {
  uploadFields(req, res, async function (err) {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }
    const {
      title,
      description,
      date,
      category,
      visibility,
      expirationDate,
      createdBy,
      defaultPermissionLevel,
      status,
      society_id,
    } = req.body;

    const announcementId = req.params.id;

    // Handle uploaded images
    const images = req.files.images
      ? req.files.images.map((doc) => doc.path)
      : [];

    try {
      // Find the announcement by ID
      const announcement = await announcementSchema.findById(announcementId);

      if (!announcement) {
        return res.status(404).json({
          success: false,
          msg: "Announcement not found",
        });
      }

      // Update fields
      announcement.title = title || announcement.title;
      announcement.description = description || announcement.description;
      announcement.date = date || announcement.date;
      announcement.category = category || announcement.category;
      announcement.visibility = visibility || announcement.visibility;
      announcement.expirationDate =
        expirationDate || announcement.expirationDate;
      announcement.createdBy = createdBy || announcement.createdBy;
      announcement.defaultPermissionLevel =
        defaultPermissionLevel || announcement.defaultPermissionLevel;
      announcement.status = status || announcement.status;
      announcement.society_id = society_id || announcement.society_id;
      if (images.length > 0) {
        announcement.images = [...announcement.images, ...images];
      }
      const updatedAnnouncement = await announcement.save();

      return res.status(200).json({
        success: true,
        msg: "Announcement updated successfully!",
        data: updatedAnnouncement,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({
        success: false,
        msg: "Server error",
      });
    }
  });
};
