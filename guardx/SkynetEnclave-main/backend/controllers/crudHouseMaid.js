const user = require("../Models/verifiedUserSchema");

exports.delHouseMaid = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await user.findByIdAndDelete(id);

    return res.status(201).json({
      success: true,
      msg: "Data deleted",
      details: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");

// Ensure the uploads directory exists
const uploadsDir = "./public/HouseMaidimage";
fs.ensureDirSync(uploadsDir);

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const newFileName = "maid-image-" + Date.now() + extension;
    cb(null, newFileName);
  },
});

// const upload = multer({ storage: storage }).array('image');
const upload = multer({ storage: storage }).fields([
  { name: "image" },
  { name: "aadharImage" },
  { name: "optionalImage" },
]);

exports.updateHouseMaidImages = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const id = req.params.id;

    const newImages = req.files.image
      ? req.files.image.map((file) => file.path)
      : [];
    const newAadharImages = req.files.aadharImage
      ? req.files.aadharImage.map((file) => file.path)
      : [];
    const newOptionalImages = req.files.optionalImage
      ? req.files.optionalImage.map((file) => file.path)
      : [];

    try {
      const result = await user.findById(id);
      if (!result) {
        return res.status(400).json({
          success: false,
          msg: "Maid not found",
        });
      }

      // Ensure result.image is an array
      result.image = Array.isArray(result.image) ? result.image : [];
      result.aadharImage = Array.isArray(result.aadharImage)
        ? result.aadharImage
        : [];
      result.optionalImage = Array.isArray(result.optionalImage)
        ? result.optionalImage
        : [];

      // Append new images to the images array without deleting old images
      result.image = result.image.concat(newImages);
      result.aadharImage = result.aadharImage.concat(newAadharImages);
      result.optionalImage = result.optionalImage.concat(newOptionalImages);

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

exports.getHouseMaid = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await user.findById(id);
    if (!result) {
      return res.status(400).json({
        success: false,
        msg: "Maid not found",
      });
    } else {
      return res.status(201).json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.deleteImage = async (req, res) => {
  const { imageType, imageUrl } = req.body;

  if (!["image", "aadharImage", "optionalImage"].includes(imageType)) {
    return res.status(400).json({ message: "Invalid image type" });
  }

  try {
    const entry = await user.findById(req.params.id);

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

exports.updateHouseMaidData = async (req, res) => {
  const id = req.params.id;
  try {
    // Find the housemaid by ID
    const result = await user.findById(id);
    if (!result) {
      return res.status(400).json({
        success: false,
        msg: "Maid not found",
      });
    }

    // Update housemaid data fields
    result.houseMaidHindi = req.body.houseMaidHindi;
    result.houseMaidEnglish = req.body.houseMaidEnglish;
    result.gender = req.body.gender;
    result.address = req.body.address;
    result.aadharNumber = req.body.aadharNumber;

    // Save the updated housemaid data
    await result.save();

    return res.status(200).json({
      success: true,
      msg: "Housemaid data updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
