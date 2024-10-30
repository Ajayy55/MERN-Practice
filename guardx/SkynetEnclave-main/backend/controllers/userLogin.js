const User = require("../Models/guardInOut");
exports.guardInOut = async (req, res) => {
  const { guardId, societyId, createdBy, date } = req.body;
  try {
    const lastEntry = await User.findOne({ guardId })
      .sort({ _id: -1 })
      .limit(1);

    if (!lastEntry || lastEntry.clockOutTime !== null) {
      const newUser = await new User({ guardId, societyId, createdBy, date });
      newUser.clockInTime = getCurrentTime();
      newUser.clockOutTime = null;
      await newUser.save();
      return res
        .status(200)
        .json({ message: "User clocked in successfully", user: newUser });
    } else {
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

exports.getGuardInOut = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
    });
  }
};
