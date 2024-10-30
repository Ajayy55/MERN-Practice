const announcementSchema = require("../../Models/announcementSchema");
exports.deleteAnnouncement = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await announcementSchema.findByIdAndDelete(id);
    if (response) {
      res.status(200).json({
        success: true,

        data: response,
        msg: "Announcement delete Successfully",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Announcement not deleted",
    });
  }
};
