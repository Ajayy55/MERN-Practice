// const Society = require("../../Models/societySchema");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// // Function to ensure the directory exists
// const ensureDirectoryExists = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };
// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadDir;
//     const fileType = file.mimetype;

//     if (fileType.startsWith("image")) {
//       uploadDir = "./public/societyImages/";
//     } else if (
//       fileType === "application/pdf" ||
//       fileType.includes("msword") ||
//       fileType.includes("document")
//     ) {
//       uploadDir = "./public/societyDocuments/";
//     } else {
//       return cb(
//         new Error("Invalid file type. Only images and documents are allowed."),
//         false
//       );
//     }
//     ensureDirectoryExists(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });

// // Multer upload setup
// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// const multipleUpload = upload.fields([
//   { name: "societyDocuments", maxCount: 10 },
// ]);

// // API to handle media upload
// exports.societyDocumentsUpload = (req, res) => {
//   multipleUpload(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json({ error: err.message });
//     } else if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     try {
//       const id = req.params.id;
//       if (!id) {
//         return res.status(400).json({ error: "Society ID is required" });
//       }

//       // Find the society
//       const society = await Society.findById(id);
//       if (!society) {
//         return res.status(404).json({ error: "Society not found" });
//       }

//       // Get uploaded files (we expect them to be in societyDocuments field)
//       const societyDocuments = req.files["societyDocuments"] || [];

//       const savedDocuments = societyDocuments.map((file) => ({
//         path: file.path,
//         type: file.mimetype.startsWith("image") ? "image" : "document",
//       }));

//       // Update society's media
//       society.societyDocuments = society.societyDocuments || [];
//       society.societyDocuments.push(...savedDocuments);

//       // Save society with updated media
//       await society.save();

//       // Response with uploaded file details
//       res.json({
//         message: "Documents uploaded and saved successfully",
//         id,
//         uploadedDocuments: savedDocuments,
//       });
//     } catch (error) {
//       return res.status(500).json({ error: "Something went wrong" });
//     }
//   });
// };
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
    const fileType = file.mimetype;

    if (fileType.startsWith("image")) {
      uploadDir = "./public/societyImages/";
    } else if (
      fileType === "application/pdf" ||
      fileType.includes("msword") || 
      fileType.includes("document")
    ) {
      uploadDir = "./public/societyDocuments/";
    } else {
      return cb(
        new Error("Invalid file type. Only images and documents are allowed."),
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

// Multer upload setup
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const multipleUpload = upload.fields([
  { name: "societyDocuments", maxCount: 10 }, // Adjust maxCount as needed
]);

// API to handle media upload
exports.societyDocumentsUpload = (req, res) => {
  multipleUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err.message);
      return res.status(500).json({ error: "Multer error: " + err.message });
    } else if (err) {
      console.error("Unknown error during upload:", err.message);
      return res.status(500).json({ error: "Upload error: " + err.message });
    }

    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Society ID is required" });
      }

      // Find the society
      const society = await Society.findById(id);
      if (!society) {
        return res.status(404).json({ error: "Society not found" });
      }

      // Get uploaded files (expecting them in societyDocuments field)
      const societyDocuments = req.files["societyDocuments"] || [];

      if (!societyDocuments.length) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const savedDocuments = societyDocuments.map((file) => ({
        path: file.path,
        type: file.mimetype.startsWith("image") ? "image" : "document", // Assign document type
      }));

      // Update society's media
      society.societyDocuments = society.societyDocuments || [];
      society.societyDocuments.push(...savedDocuments);

      // Save society with updated media
      await society.save();

      // Response with uploaded file details
      res.json({
        message: "Documents uploaded and saved successfully",
        id,
        uploadedDocuments: savedDocuments,
      });
    } catch (error) {
      console.error("Error saving society documents:", error);
      return res.status(500).json({ error: "Something went wrong: " + error.message });
    }
  });
};

