// clockOut
const User = require("../Models/nonVerify");
const getCurrentTime = () => {
  const currentDate = new Date();
  const ISTTime = currentDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
  });
  console.log(ISTTime);
  return ISTTime;
};
exports.nonverifyClockOut = async (req, res) => {
  const id = req.params.id;
  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Get the current time
    const clockOutTime = getCurrentTime();
    // Update the user's clockOut time
    user.clockOut = clockOutTime; 
    await user.save();
    console.log(user);
    res
      .status(200)
      .json({ message: "User clocked out successfully", clockOutTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
