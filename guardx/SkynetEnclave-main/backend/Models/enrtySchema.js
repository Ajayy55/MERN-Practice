const mongoose = require("mongoose");

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  return `${date}-${month}-${year}`;
};

const entrySchema = new mongoose.Schema({
  titleHindi: {
    type: String,
    trim: true,
    // required: true
  },
  titleEnglish: {
    type: String,
    trim: true,
    // required: true
  },
  icon: {
    type: Object,
    trim: true,
    // required: true
  },
  entryType: {
    type: String,
    trim: true,
    // required: true,
  },
  joiningDate: {
    type: String,
    default: getCurrentDate,
  },
  society_id: {
    type: String,
    default: null,
  },
  createdBy: {
    type: String,
    default: null,
  },
  defaultPermissionLevel: {
    type: String,
    default: null,
  },
  created_by_edit:{
    type: String,
    default: null, 
  }
});
module.exports = mongoose.model("entryTypes", entrySchema);
