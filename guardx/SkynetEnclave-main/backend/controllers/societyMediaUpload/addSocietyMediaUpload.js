const Society = require("../../Models/societySchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Function to ensure the directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.mimetype.startsWith("image")) {
      uploadDir = "./public/societyImages/";
    } else if (file.mimetype.startsWith("video")) {
      uploadDir = "./public/societyVideos/";
    } else {
      return cb(
        new Error("Invalid file type. Only images and videos are allowed."),
        false
      );
    }
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype.startsWith("video")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP images, and videos are allowed"), false);
  }
};
// Multer upload setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const multipleUpload = upload.fields([{ name: "images" }, { name: "videos" }]);
// API to handle media upload
exports.societyMediaUpload = (req, res) => {
  multipleUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Society ID is required" });
      }
      const society = await Society.findById(id);
      if (!society) {
        return res.status(404).json({ error: "Society not found" });
      }

      // Get uploaded files
      const images = req.files["images"] || [];
      const videos = req.files["videos"] || [];
      const savedImages = images.map((file) => ({
        path: file.path,
        type: "image",
      }));

      const savedVideos = videos.map((file) => ({
        path: file.path,
        type: "video",
      }));
      society.media = society.media || [];
      society.media.push(...savedImages, ...savedVideos);
      await society.save();
      res.json({
        message: "Media uploaded and saved successfully",
        id,
        uploadedMedia: { images: savedImages, videos: savedVideos },
      });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  });
};
