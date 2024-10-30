const announcementSchema = require("../../Models/announcementSchema");
const multer = require("multer");
const path = require("path");
// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const uploadFields = upload.fields([{ name: "images", maxCount: 10 }]);
exports.addAnnouncement = (req, res) => {
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

    // Handle rwaDocuments
    const images = req.files.images
      ? req.files.images.map((doc) => doc.path)
      : [];

    try {
      const newAnnouncement = await announcementSchema.create({
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
        images,
      });

      return res.status(201).json({
        success: true,
        msg: "Announcement added!",
        data: newAnnouncement,
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
