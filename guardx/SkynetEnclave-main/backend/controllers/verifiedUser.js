const User = require("../Models/verifiedUserSchema");
const express = require("express");
const app = express();

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
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// Middleware to handle multiple file uploads
const multipleUpload = upload.fields([
  { name: "image" },
  { name: "aadharImage" },
  { name: "optionalImage" },
]);

exports.verifyHouseMaid = async (req, res) => {
  multipleUpload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Failed to upload files" });
    }

    try {
      const {
        houseMaidHindi,
        houseMaidEnglish,
        gender,
        address,
        aadharNumber,
        paramsId,
        clockoutTime,
      } = req.body;
      let houseSelect = [];
      if (req.body["houseSelect"]) {
        houseSelect = req.body["houseSelect"]
          .map((option) => {
            try {
              return JSON.parse(option);
            } catch (e) {
              console.error("Error parsing houseSelect option:", option, e);
              return null;
            }
          })
          .filter((option) => option !== null);
      }
      if (req.files["image"] && Array.isArray(req.files["image"])) {
        imagePaths = req.files["image"].map((file) => file.path);
      }
      const aadharImage = req.files["aadharImage"]
        ? req.files["aadharImage"].map((file) => file.path)
        : [];
      const optionalImage = req.files["optionalImage"]
        ? req.files["optionalImage"].map((file) => file.path)
        : [];
      const existingUser = await User.findOne({ aadharNumber });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Aadhaar Number already registered" });
      }
      const responseUser = await User.create({
        houseMaidHindi,
        houseMaidEnglish,
        gender,
        address,
        aadharNumber,
        paramsId,
        image: imagePaths,
        aadharImage,
        clockoutTime,
        optionalImage,
        houseSelect,
      });

      return res.status(201).json({
        success: true,
        verifyHouseMaid: responseUser,
        msg: "Regular Entries Added ",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
