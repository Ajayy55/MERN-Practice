const announcementSchema = require("../../Models/announcementSchema");
exports.getAnnouncement = async (req, res) => {
  try {
    const response = await announcementSchema.find();
    res.status(200).json({
      success: true,
      data: response,
      msg: "Data get Succcessfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
