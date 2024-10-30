const mongoose = require("mongoose");
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  return `${date}-${month}-${year}`;
};
const getCurrentTime = () => {
  const currentDate = new Date();
  const ISTTime = currentDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
  });
  return `${ISTTime}`;
};
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: Object,
  },
  date: {
    type: String,
    default: getCurrentDate,
  },
  category: {
    type: String,
    enum: ["Event", "Maintenance", "News", "Security", "Power Supply", "Other"],
    default: "Other",
  },
  visibility: {
    type: [String],
    enum: ["Public", "Members", "Admin"],
    default: ["Public"],
  },
  expirationDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "active",
  },
  createdBy: {
    type: String,
  },
  society_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addsocieties",
  },
  defaultPermissionLevel: { type: String },
  time: {
    type: String,
    default: getCurrentTime,
  },
});
// Create a model from the schema
const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
