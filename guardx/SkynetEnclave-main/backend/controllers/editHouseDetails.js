const user = require("../Models/houseSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const uploadsDir = "./public/houseOwnerImages";
fs.ensureDirSync(uploadsDir);
exports.getHouseDetailsToEdit = async (req, res) => {
  const id = req.params.id;
  try {
    const getHouseDetails = await user.findById(id);
    if (!getHouseDetails) {
      return res.status(404).json({
        success: false,
        msg: "House Details not found",
      });
    }
    return res.status(200).json({
      success: true,
      details: getHouseDetails,
    });
  } catch (error) {
    console.error("Error fetching house details:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
exports.updateHouseDetails = [
  upload.single("ownerImages"),
  async (req, res) => {
    const id = req.params.id;
    try {
      const updateDetails = await user.findById(id);
      if (!updateDetails) {
        return res.status(404).json({ success: false, msg: "Entry not found" });
      }
      if (req.body.username) {
        const existingUser = await user.findOne({
          username: req.body.username,
          _id: { $ne: id },  
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            msg: "Username already exists",
          });
        }
      }
      if (req.body.userPhoneNo) {
        const existingUserPhone = await user.findOne({
          userPhoneNo: req.body.userPhoneNo,
          _id: { $ne: id }, 
        });
        if (existingUserPhone) {
          return res.status(400).json({
            success: false,
            msg: "Phone number already exists",
          });
        }
      }
      updateDetails.houseNo = req.body.houseNo ? req.body.houseNo : "";
      updateDetails.ownerName = req.body.ownerName ? req.body.ownerName : "";
      updateDetails.aadhaarNumber = req.body.aadhaarNumber ? req.body.aadhaarNumber : "";
      updateDetails.blockNumber = req.body.blockNumber ? req.body.blockNumber : "";
      updateDetails.isRwaMember = req.body.isRwaMember ? req.body.isRwaMember : "";
      updateDetails.password = req.body.password ? req.body.password : "";
      if (req.body.username) {
        updateDetails.username = req.body.username;
      }
      if (req.body.userPhoneNo) {
        updateDetails.userPhoneNo = req.body.userPhoneNo;
      }
      if (req.file) {
        updateDetails.ownerImages = req.file.path;
      }

      // Save the updated details
      await updateDetails.save();
      return res.status(200).json({
        success: true,
        msg: "Details updated",
        details: updateDetails,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Internal server error" });
    }
  },
];

exports.delHouseDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const delDetails = await user.findByIdAndDelete(id);
    if (delDetails) {
      return res.status(200).json({
        sucess: true,
        msg: "House Details deleted",
      });
    }
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      msg: "House Details not deleted",
    });
  }
};
