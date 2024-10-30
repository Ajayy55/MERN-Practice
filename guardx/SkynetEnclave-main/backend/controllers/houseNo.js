const user = require("../Models/houseSchema");
const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { sendEmail } = require("../utils/sendEmailToHouseOwner/sendEmail");
//generateRandomPassword
const generateRandomPassword = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};

exports.houseDetails = async (req, res) => {
  try {
    const {
      houseNo,
      blockNumber,
      society_id,
      createdBy,
      defaultPermissionLevel,
    } = req.body;

    const responseUser = await user.create({
      houseNo,
      blockNumber,
      society_id,
      createdBy,
      society_id,
      defaultPermissionLevel,
    });

    return res.status(201).json({
      success: true,
      verifyHouseMaid: responseUser,
      msg: "House Details Added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  // });
};
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
// Add HouseOwner And Vehicles
const multipleUpload = upload.fields([
  { name: "ownerImages" },
  { name: "vehicleImages" },
]);
exports.addHouseOwnerBySocietyAdmin = (req, res) => {
  multipleUpload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).json({ error: "Failed to upload files" });
    }
    const id = req.params.id;
    try {
      let existingOwner = await user.findById(id);

      const {
        ownerName,
        userPhoneNo,
        username,
        password,
        aadhaarNumber,
        isRwaMember,
      } = req.body;

      // Handle vehicle data
      let vehicleData = [];
      const vehicles = req.body.vehicles;
      if (vehicles) {
        if (Array.isArray(vehicles)) {
          vehicleData = vehicles.map((vehicle, index) => {
            const vehicleImage =
              req.files["vehicleImages"] && req.files["vehicleImages"][index]
                ? req.files["vehicleImages"][index].path
                : null;
            return {
              type: vehicle.type,
              number: vehicle.number,
              image: vehicleImage,
            };
          });
        } else {
          const vehicleImage = req.files["vehicleImages"]
            ? req.files["vehicleImages"].path
            : null;
          vehicleData.push({
            type: vehicles.type,
            number: vehicles.number,
            image: vehicleImage,
          });
        }
      }
      if (existingOwner) {
        existingOwner.ownerName = ownerName || existingOwner.ownerName;
        existingOwner.userPhoneNo = userPhoneNo || existingOwner.userPhoneNo;
        existingOwner.username = username || existingOwner.username;
        existingOwner.aadhaarNumber =
          aadhaarNumber || existingOwner.aadhaarNumber;
        existingOwner.isRwaMember =
          isRwaMember !== undefined ? isRwaMember : existingOwner.isRwaMember;
        if (password) {
          existingOwner.password = password;
        }
        if (
          req.files &&
          req.files["ownerImages"] &&
          req.files["ownerImages"].length > 0
        ) {
          existingOwner.ownerImages = req.files["ownerImages"].map(
            (file) => file.path
          );
        }

        // Update vehicle data by merging the new vehicleData array with the existing vehicles array
        existingOwner.vehicles = [
          ...(existingOwner.vehicles || []),
          ...vehicleData,
        ];

        await existingOwner.save();
        return res.status(200).json({
          message: "Data updated successfully",
          data: existingOwner,
        });
      } else {
        // Create a new owner if not found
        let ownerImages = [];
        if (
          req.files &&
          req.files["ownerImages"] &&
          req.files["ownerImages"].length > 0
        ) {
          ownerImages = req.files["ownerImages"].map((file) => file.path);
        }

        const newOwner = new user({
          ownerName,
          userPhoneNo,
          username,
          password,
          ownerImages,
          aadhaarNumber,
          vehicles: vehicleData,
          isRwaMember,
        });

        await newOwner.save();
        return res
          .status(201)
          .json({ message: "Data created successfully", data: newOwner });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
};
// deleteVehicleByIndex
exports.deleteVehicleByIndex = async (req, res) => {
  const { ownerId, vehicleIndex } = req.params;
  try {
    const existingOwner = await user.findById(ownerId);
    if (!existingOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    const index = parseInt(vehicleIndex, 10);
    if (isNaN(index)) {
      return res
        .status(400)
        .json({ error: "Invalid vehicle index - not a number" });
    }
    if (index < 0 || index >= existingOwner.vehicles.length) {
      return res
        .status(400)
        .json({ error: "Invalid vehicle index - out of range" });
    }
    existingOwner.vehicles = existingOwner.vehicles.filter(
      (_, i) => i !== index
    );
    const updatedOwner = await existingOwner.save();
    return res
      .status(200)
      .json({ message: "Vehicle deleted successfully", data: updatedOwner });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the vehicle" });
  }
};
// Add House Owner By House owner
exports.addHouseOwnerByHouseOwner = async (req, res) => {
  const { username, houseNo, blockNumber, aadhaarNumber } = req.body;
  // Check if a house owner with the same username already exists
  const existingUsername = await user.findOne({ username: username });
  if (existingUsername) {
    return res.status(400).json({
      success: false,
      message: "Username already exists",
    });
  }

  // Check if a house owner with the same house number already exists
  const existingHouseNo = await user.findOne({ houseNo: houseNo });
  if (existingHouseNo) {
    return res.status(400).json({
      success: false,
      message: "House number already exists",
    });
  }

  // Check if a house owner with the same block number already exists
  const existingBlockNumber = await user.findOne({ blockNumber: blockNumber });
  if (existingBlockNumber) {
    return res.status(400).json({
      success: false,
      message: "Block number already exists ",
    });
  }

  // Check if a house owner with the same Aadhaar number already exists
  const existingAadhaarNumber = await user.findOne({
    aadhaarNumber: aadhaarNumber,
  });
  if (existingAadhaarNumber) {
    return res.status(400).json({
      success: false,
      message: " Aadhaar number already exists",
    });
  }

  const houseData = new user({
    ...req.body,
    approvalStatus: "pending",
  });

  houseData
    .save()
    .then((data) => {
      res.json({
        success: true,
        message: "House owner added, pending approval",
        data,
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "Error adding house owner", error });
    });
};
//Approved House Owner By Society Admin
exports.approveHouseOwnerBySocietyAdmin =async (req, res) => {
  const { houseId, approvedBy, approvalStatus } = req.body;
  let isUsernamExist = await user.findById(houseId);
      if (!isUsernamExist.username || isUsernamExist.username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Username is required for approval",
      });
    }
  // Generate a random password for the house owner
  let updateFields = {
    approvalStatus: approvalStatus,
    approvedBy: approvedBy,
  };
  
  if (approvalStatus === 'approved') {
    const password = generateRandomPassword(10);
    updateFields.password = password;
  }
  user
    .findByIdAndUpdate(
      houseId,
      updateFields,
      { new: true }
    )
    .then((updatedHouse) => {
      if (updatedHouse) {
        // Send an email only if the house owner is approved
        if (approvalStatus === "approved") {
          sendEmail(updatedHouse);
          res.json({
            success: true,
            message: "House owner approved",
            data: updatedHouse,
          });
        } else if (approvalStatus === "rejected") {
          res.json({
            success: true,
            message: "House owner rejected",
            data: updatedHouse,
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "House owner not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Error approving house owner",
        error,
      });
    });
};

