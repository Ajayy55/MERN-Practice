const signUpSchema = require("../Models/signUpSchema");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "rwaImages", maxCount: 1 },
  { name: "rwaDocuments", maxCount: 10 },
]);
// Add SignUp User
exports.signUp = (req, res) => {
  uploadFields(req, res, async function (err) {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }
    const {
      username,
      userPhoneNo,
      password,
      confirmpassword,
      role,
      isActive,
      createdBy,
      name,
      defaultPermissionLevel,
      society_id,
    } = req.body;

    // Handle rwaImages
    const rwaImages = req.files.rwaImages ? req.files.rwaImages[0].path : "";

    // Handle rwaDocuments
    const rwaDocuments = req.files.rwaDocuments
      ? req.files.rwaDocuments.map((doc) => doc.path)
      : [];

    // Validate password matching
    if (password !== confirmpassword) {
      return res
        .status(400)
        .json({ success: false, msg: "Passwords do not match" });
    }

    try {
      // Check if username or mobile already exists
      const existingUser = await signUpSchema.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, msg: "Username already exists" });
      }

      const existingMobile = await signUpSchema.findOne({ userPhoneNo });
      if (existingMobile) {
        return res
          .status(401)
          .json({ success: false, msg: "Mobile number already exists" });
      }

      // Create new user with the uploaded file paths
      const newUser = await signUpSchema.create({
        username,
        userPhoneNo,
        password,
        role,
        isActive,
        createdBy,
        name,
        defaultPermissionLevel,
        society_id,
        rwaImages,
        rwaDocuments,
      });

      return res.status(201).json({
        success: true,
        msg: "User added!",
        userData: newUser,
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
// Edit SignUp User
exports.editUser = (req, res) => {
  uploadFields(req, res, async function (err) {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    }

    const {
      username,
      userPhoneNo,
      password,
      confirmpassword,
      role,
      isActive,
      createdBy,
      name,
      defaultPermissionLevel,
      society_id,
    } = req.body;

    const { id: userId } = req.params; // Extract userId from URL params
    const rwaImages = req.files.rwaImages ? req.files.rwaImages[0].path : "";

    // Handle updated rwaDocuments if new documents are uploaded
    const rwaDocuments = req.files.rwaDocuments
      ? req.files.rwaDocuments.map((doc) => doc.path)
      : [];

    // Validate password matching
    if (password !== confirmpassword) {
      return res
        .status(400)
        .json({ success: false, msg: "Passwords do not match" });
    }

    try {
      // Find the user to update by userId
      const user = await signUpSchema.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
      }

      // Check if username or mobile number exists for other users
      const existingUser = await signUpSchema.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, msg: "Username already exists" });
      }

      const existingMobile = await signUpSchema.findOne({
        userPhoneNo,
        _id: { $ne: userId },
      });
      if (existingMobile) {
        return res
          .status(401)
          .json({ success: false, msg: "Mobile number already exists" });
      }

      // Update user details with the provided data
      user.username = username || user.username;
      user.userPhoneNo = userPhoneNo || user.userPhoneNo;
      if (password) {
        user.password = password;
      }
      user.role = role || user.role;
      user.isActive = isActive !== undefined ? isActive : user.isActive;
      user.createdBy = createdBy || user.createdBy;
      user.name = name || user.name;
      user.defaultPermissionLevel =
        defaultPermissionLevel || user.defaultPermissionLevel;
      user.society_id = society_id || user.society_id;

      // Update rwaImages if a new image is uploaded
      if (rwaImages) {
        user.rwaImages = rwaImages;
      }

      // Update rwaDocuments if new documents are uploaded
      if (rwaDocuments.length > 0) {
        user.rwaDocuments = rwaDocuments;
      }

      // Save the updated user
      const updatedUser = await user.save();

      return res.status(200).json({
        success: true,
        msg: "User details updated successfully!",
        userData: updatedUser,
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

// Get SIgnUp User
exports.getSignUpUser = async (req, res) => {
  try {
    const userData = await signUpSchema.find();
    return res.status(201).json({
      success: true,
      msg: "User Get",
      userData: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
// Delete SignUp User
exports.signUpUserDelete = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteRole = await signUpSchema.findByIdAndDelete(id);
    if (!deleteRole) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "User is Deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error); // Log the error
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
//GetEdit SignUp User
exports.getEditData = async (req, res) => {
  const id = req.params.id;
  try {
    const getEditRole = await signUpSchema.findById(id);
    return res.status(200).json({
      success: true,
      msg: "User is Get",
      data: getEditRole,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
// Edit SignUp User
exports.editSignUpUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Find the user by ID and update their information
    const user = await signUpSchema.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
//request Deactivation By Guard
exports.requestDeactivation = async (req, res) => {
  try {
    const { userId ,requestedDeactivationComment} = req.body;
    const user = await signUpSchema.findByIdAndUpdate(
      userId,
      {
        requestedDeactivation: true,
        requestedDeactivationComment:requestedDeactivationComment
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Deactivation request submitted successfully",
      guard: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error submitting deactivation request",
      error: error.message,
    });
  }
};
//approveDeactivation By Society Admin
exports.approveDeactivation = async (req, res) => {
  const { userId ,status} = req.body;
  try {
    const foundUser = await signUpSchema.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (foundUser.requestedDeactivation) {
      (foundUser.isActive = status), (foundUser.requestedDeactivation = false);
      await foundUser.save();
      return res.status(200).json({
        message: "Guard account deactivated successfully",
        data: foundUser,
      });
    } else {
      return res
        .status(400)
        .json({ message: "No deactivation request found for this guard" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error deactivating guard account",
      error: error.message,
    });
  }
};
