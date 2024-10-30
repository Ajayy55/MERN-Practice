const societySchema = require("../Models/societySchema");
const signUpSchema = require("../Models/signUpSchema");
exports.editAdminimage = async (req, res) => {
  try {
    const id = req.params.id;
    const { userPhoneNo, username, name } = req.body;
    if (!req.file && !userPhoneNo && !username && !name) {
      return res.status(400).json({ error: "No data to update" });
    }
    // Fetch user data from MongoDB using Mongoose
    let userData =
      (await societySchema.findById(id)) || (await signUpSchema.findById(id));

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the provided username or phone number is already in use by another user
    if (username) {
      const existingUserByUsername =
        (await societySchema.findOne({ username, _id: { $ne: id } })) ||
        (await signUpSchema.findOne({ username, _id: { $ne: id } }));
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    if (userPhoneNo) {
      const existingUserByPhoneNo =
        (await societySchema.findOne({ userPhoneNo, _id: { $ne: id } })) ||
        (await signUpSchema.findOne({ userPhoneNo, _id: { $ne: id } }));
      if (existingUserByPhoneNo) {
        return res.status(400).json({ error: "Phone number is already taken" });
      }
    }
    if (req.file) {
      const imageUrl = req.file.path;
      userData.Ownerimage = imageUrl;
    }
    if (userPhoneNo) {
      userData.userPhoneNo = userPhoneNo;
    }
    if (username) {
      userData.username = username;
    }
    if (name) {
      userData.name = name;
    }
    // Save updated user data to MongoDB
    const updatedData = await userData.save();
    res
      .status(200)
      .json({ message: "User data updated successfully", data: updatedData });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Failed to update user data" });
  }
};
exports.editSuperAdminimage = async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No data to update" });
    }

    let userData =
      (await societySchema.findById(id)) || (await signUpSchema.findById(id));

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      const imageUrl = req.file.path;

      userData.superAdminPhoto = userData.superAdminPhoto || [];

      if (userData.superAdminPhoto.length > 0) {
        userData.superAdminPhoto[0] = imageUrl;
      } else {
        userData.superAdminPhoto.push(imageUrl);
      }
    }
    const updatedData = await userData.save();
    res
      .status(200)
      .json({ message: "User data updated successfully", data: updatedData });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Failed to update user data" });
  }
};
