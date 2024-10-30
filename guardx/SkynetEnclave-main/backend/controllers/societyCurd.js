const User = require("../Models/societySchema");
const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");

app.use(express.static("public"));
// Add Society
const uploadsDir = "./public/Image";
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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and WEBP files are allowed."
        )
      );
    }
  },
});

const multipleUpload = upload.fields([{ name: "societyLogo" }]);

// Add Society
exports.addSociety = async (req, res) => {
  try {
    multipleUpload(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Only JPEG, PNG, and WEBP files are allowed" });
      }

      const {
        name,
        address,
        societyContactNumber,
        createdBy,
        defaultPermissionLevel,
        role,
        societyRegistration,
        societyHouseList,
        state,
        city,
      } = req.body;
      const societyLogo = req.files["societyLogo"]
        ? req.files["societyLogo"][0].path
        : "";

      // Check for existing society by name or contact number
      const existingName = await User.findOne({ name });
      if (existingName) {
        return res.status(400).json({ error: "Society name already exists" });
      }

      const existingContactName = await User.findOne({ societyContactNumber });
      if (existingContactName) {
        return res.status(400).json({ error: "Contact number already exists" });
      }

      // Create and save new society
      const newSociety = new User({
        name,
        address,
        societyContactNumber,
        societyLogo,
        createdBy,
        defaultPermissionLevel,
        role,
        societyRegistration,
        societyHouseList,
        state,
        city
      });

      const savedSociety = await newSociety.save();
      return res.status(201).json({
        success: true,
        addSociety: savedSociety,
        msg: "Society added successfully",
      });
    });
  } catch (error) {
    console.error("Error adding society:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get Society
exports.getSocietyData = async (req, res) => {
  try {
    const entries = await User.find();
    return res.status(200).json({
      success: true,
      societyData: entries,
    });
  } catch (error) {
    console.error("Error fetching society data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Delete Society endpoint
exports.delSociety = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);
    if (result) {
      return res.status(201).json({
        msg: "Society data deleted successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        msg: "Society not found",
      });
    }
  } catch (error) {
    console.error("Error deleting society:", error);
    return res.status(500).json({
      msg: "Data not deleted",
      error: "Internal Server Error",
    });
  }
};

exports.userWithSociety = async (req, res) => {
  try {
    const data = await User.find({ _id: req.body.id }).populate("createdBy");
    res.send({ data: data });
  } catch (error) {
    console.log(error);
  }
};
//GetSociety Details With Id
exports.getSocietyDetailsWithId = async (req, res) => {
  const id = req.params.id;
  try {
    const societyDetails = await User.findById(id);
    return res.status(200).json({
      success: true,
      data: societyDetails,
    });
  } catch (error) {
    console.error("Error fetching society data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
//Updated Society ImagesWith Id
// Put upload Function
const uploadSocietyUserImages = multer({ storage: storage }).fields([
  // secretaryPhoto", "secretaryDetails", "societyImages","superAdminPhoto","superAdminDocument"
  { name: "secretaryPhoto" },
  { name: "secretaryDetails" },
  { name: "societyImages" },
  { name: "superAdminPhoto" },
  { name: "superAdminDocument" },
]);
//Updated Society Images With Id
exports.updateSocietyImagesWithId = async (req, res) => {
  uploadSocietyUserImages(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }
    const id = req.params.id;
    const newSecretaryPhoto = req.files.secretaryPhoto
      ? req.files.secretaryPhoto.map((file) => file.path)
      : [];
    const newSecretaryDetails = req.files.secretaryDetails
      ? req.files.secretaryDetails.map((file) => file.path)
      : [];
    const newSocietyImages = req.files.societyImages
      ? req.files.societyImages.map((file) => file.path)
      : [];
    const newSuperAdminPhoto = req.files.superAdminPhoto
      ? req.files.superAdminPhoto.map((file) => file.path)
      : [];
    const newSuperAdminDocument = req.files.superAdminDocument
      ? req.files.superAdminDocument.map((file) => file.path)
      : [];

    try {
      const result = await User.findById(id);
      if (!result) {
        return res.status(400).json({
          success: false,
          msg: "Society not found",
        });
      }
      // secretaryPhoto", "secretaryDetails", "societyImages","superAdminPhoto","superAdminDocument"

      // Ensure result.image is an array
      result.secretaryPhoto = Array.isArray(result.secretaryPhoto)
        ? result.secretaryPhoto
        : [];
      result.secretaryDetails = Array.isArray(result.secretaryDetails)
        ? result.secretaryDetails
        : [];
      result.societyImages = Array.isArray(result.societyImages)
        ? result.societyImages
        : [];
      result.superAdminPhoto = Array.isArray(result.superAdminPhoto)
        ? result.superAdminPhoto
        : [];
      result.superAdminDocument = Array.isArray(result.superAdminDocument)
        ? result.superAdminDocument
        : [];
      // Append new images to the images array without deleting old images
      result.secretaryPhoto = result.secretaryPhoto.concat(newSecretaryPhoto);
      result.secretaryDetails =
        result.secretaryDetails.concat(newSecretaryDetails);
      result.societyImages = result.societyImages.concat(newSocietyImages);
      result.superAdminPhoto =
        result.superAdminPhoto.concat(newSuperAdminPhoto);
      result.superAdminDocument = result.superAdminDocument.concat(
        newSuperAdminDocument
      );
      await result.save();
      res.status(200).json({
        msg: "Data updated!",
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
};

//DeleteSocietyUserImagesWithId
exports.deleteSocietyUserImagesWithId = async (req, res) => {
  const { imageType, imageUrl } = req.body;
  console.log(imageType);
  if (
    ![
      "secretaryPhoto",
      "secretaryDetails",
      "societyImages",
      "superAdminPhoto",
      "superAdminDocument",
    ].includes(imageType)
  ) {
    return res.status(400).json({ message: "Invalid image type" });
  }

  try {
    const entry = await User.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Remove the image URL from the specified image type array
    entry[imageType] = entry[imageType].filter((img) => img !== imageUrl);

    await entry.save();

    res.status(200).json({ message: "Image deleted successfully", entry });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const uploadsDirEditSocietyLogo = "./public/PurposeIcon";
fs.ensureDirSync(uploadsDir);

const storageForSocietyLogo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirEditSocietyLogo);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); // Get the file extension
    const newFileName = "icon-" + Date.now() + extension; // Generate a new unique filename with a prefix
    cb(null, newFileName);
  },
});
const uploadSocietyLogo = multer({ storage: storageForSocietyLogo }).single(
  "societyLogo"
);
//UpdateSocietyDataWithId
exports.updateSocietyDeatilsWithId = async (req, res) => {
  uploadSocietyLogo(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const id = req.params.id;

    try {
      // Find the society by ID
      const society = await User.findById(id);
      if (!society) {
        return res.status(400).json({
          success: false,
          msg: "Society not found",
        });
      }

      // Update society data fields
      society.name = req.body.name;
      society.address = req.body.address;
      society.societyContactNumber = req.body.societyContactNumber;
      society.alternateNumber = req.body.alternateNumber;
      society.secretaryName = req.body.secretaryName;
      society.secretaryContact = req.body.secretaryContact;
      society.ownerName = req.body.ownerName;
      society.userPhoneNo = req.body.userPhoneNo;
      society.societyRegistration = req.body.societyRegistration;
      society.societyHouseList = req.body.societyHouseList;
      society.superAdminName = req.body.superAdminName;
      society.superAdminContactNo = req.body.superAdminContactNo;
      society.state = req.body.state;
      society.city = req.body.city;

      // Handle society logo upload
      if (req.file && req.file.path) {
        society.societyLogo = req.file.path; // Assuming `uploadsDirForSocietyLogo` is storing the file path in `req.file.path`
      }

      // Save the updated society data
      await society.save();

      return res.status(200).json({
        success: true,
        msg: "Society data updated successfully",
        data: society,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
};
//Updated Society Logo
exports.updateSocietyLogoById = async (req, res) => {
  uploadSocietyLogo(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }
    const id = req.params.id;

    try {
      // Find the society by ID
      const society = await User.findById(id);
      if (!society) {
        return res.status(400).json({
          success: false,
          msg: "Society not found",
        });
      }

      // Handle society logo upload
      if (req.file && req.file.path) {
        society.societyLogo = req.file.path;
      } else {
        return res.status(400).json({
          success: false,
          msg: "No file uploaded",
        });
      }

      // Save the updated society logo
      await society.save();

      return res.status(200).json({
        success: true,
        msg: "Society logo updated successfully",
        data: society.societyLogo,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
};
