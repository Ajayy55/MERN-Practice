const User = require("../Models/nonVerify");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const uploadsDir = "./public/Images";
fs.ensureDirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Add a unique suffix
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Append the extension once
  },
});
const upload = multer({ storage: storage });
// Middleware to handle multiple file uploads
const multipleUpload = upload.fields([
  { name: "image" },
  { name: "aadharImage" },
]);
exports.nonVerified = async (req, res) => {
  multipleUpload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Failed to upload files" });
    }

    try {
      const {
        entryType,
        purposeType,
        houseDetails,
        name,
        phoneNumber,
        aadhaarNumber,
        submitedDate,
        submitedTime,
        createdBy,
        guardId,
        society_id,
        clockOut,
        house_id
      } = req.body;

      let imagePaths = [];
      if (req.files["image"] && Array.isArray(req.files["image"])) {
        imagePaths = req.files["image"].map((file) => file.path);
      }
      const aadharImage = req.files["aadharImage"]
        ? req.files["aadharImage"].map((file) => file.path)
        : [];
      const responseUser = await User.create({
        entryType,
        purposeType,
        houseDetails,
        adharImg: aadharImage,
        image: imagePaths,
        submitedDate,
        submitedTime,
        createdBy,
        guardId,
        society_id,
        name,
        phoneNumber,
        aadhaarNumber,
        clockOut,
        house_id
      });

      return res.status(201).json({
        success: true,
        verifyHouseMaid: responseUser,
        msg: "Occasional Entries Added successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
