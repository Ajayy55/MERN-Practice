const mongoose = require("mongoose");
const nonVerifiedPurpose = new mongoose.Schema({
  purpose: {
    type: String,
    // required : true,
    trim: true,
  },
  hindiPurpose: {
    type: String,
    // required : true,
    trim: true,
  },
  purposeIcon: {
    type: String,
  },
  createdBy: {
    type: String,
    default: null,
  },
  society_id: {
    type: String,
    default: null,
  },
  defaultPermissionLevel: {
    type: String,
    default: null,
  },
  created_by_edit: {
    type: String,
    default: null,
  },
  linkedEntry: {
    type: String,
  },
});
module.exports = mongoose.model("nonVerifiedPurpose", nonVerifiedPurpose);
