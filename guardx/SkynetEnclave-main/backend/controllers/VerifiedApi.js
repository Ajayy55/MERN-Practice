const User = require("../Models/Verified");
exports.verified = async (req, res) => {
  const { maidName, parentId, guardId,createdBy,society_id } = req.body;

  try {
    const lastEntry = await User.findOne({ parentId })
      .sort({ _id: -1 })
      .limit(1);

    if (!lastEntry || lastEntry.clockOutTime !== null) {
      console.log("Clock in time ");
      const newUser = new User({ parentId, maidName, guardId ,createdBy,society_id});
      newUser.clockInTime = getCurrentTime();
      newUser.clockOutTime = null;
      await newUser.save();
      return res
        .status(200)
        .json({ message: "User clocked in successfully", user: newUser });
    } else {
      console.log("Updating clock out time");
      lastEntry.clockOutTime = getCurrentTime();
      await lastEntry.save();
      return res
        .status(200)
        .json({ message: "User clocked out successfully", user: lastEntry });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCurrentTime = () => {
  const currentDate = new Date();
  const ISTTime = currentDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
  });
  console.log(ISTTime);
  return `${ISTTime}`;
};




