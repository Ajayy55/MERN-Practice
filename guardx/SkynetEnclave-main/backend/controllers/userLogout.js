const GuardInOut = require("../Models/guardInOut");
exports.userLogout = async (req, res) => {
  // const id = req.params.id;
  const { guardId, logoutTime } = req.body;
  // console.log(guardId)
  try {
    let guardInOutDoc = await GuardInOut.findOne({ guardId });
    if (!guardInOutDoc) {
      return res.status(404).json({ message: "GuardInOut record not found" });
    }
    // Update the checkoutTime for the guardInOut document
    guardInOutDoc.checkoutTime = logoutTime;
    await guardInOutDoc.save();

    res.json({ message: "Guard logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getGuard = async (req, res) => {
  try {
    // Find the GuardInOut document by guardId
    const guardInOutDoc = await GuardInOut.findOne();
    if (!guardInOutDoc) {
      return res.status(404).json({ message: "GuardInOut record not found" });
    }

    res.json({ data: guardInOutDoc });
  } catch (err) {
    console.error("Error fetching GuardInOut record:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
