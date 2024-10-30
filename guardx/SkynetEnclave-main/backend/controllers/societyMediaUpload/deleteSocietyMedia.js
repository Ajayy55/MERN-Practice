const Society = require("../../Models/societySchema");
exports.deleteSocietyMedia = async (req, res) => {
  const { societyId, mediaId } = req.params;

  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Filter out the media item to delete
    society.media = society.media.filter(
      (item) => item._id.toString() !== mediaId
    );

    await society.save();
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting media", error });
  }
};
exports.deleteSocietyDocuments = async (req, res) => {
  const { societyId, mediaId } = req.params;

  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }
    // Filter out the media item to delete
    society.societyDocuments = society.societyDocuments.filter(
      (item) => item._id.toString() !== mediaId
    );

    await society.save();
    res.status(200).json({ message: "Society Documents deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting media", error });
  }
};
