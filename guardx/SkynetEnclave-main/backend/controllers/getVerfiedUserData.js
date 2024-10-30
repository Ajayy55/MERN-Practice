const user = require("../Models/verifiedUserSchema");
exports.getVerifyHouseMaid = async (req, res) => {
  try {
    const paramsId = req.params.paramsId; 
    const userData = await user.find({ paramsId }).populate("paramsId");

    if (!userData) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    res.status(200).json({ success: true, verifyHouseMaid: userData });
  } catch (error) {
    console.error("Error fetching verified user:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};
exports.getAllVerifyHouseMaid = async (req, res) => {
  try {
    const userData = await user.find();

    if (!userData) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    res.status(200).json({ success: true, verifyHouseMaid: userData });
  } catch (error) {
    console.error("Error fetching verified user:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};
