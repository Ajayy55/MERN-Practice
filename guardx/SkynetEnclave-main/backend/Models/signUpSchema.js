const mongoose = require("mongoose");
const signUpSchema = new mongoose.Schema({
  username: {
    type: String,
    
  },
  userPhoneNo: {
    type: Number,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  requestedDeactivation: { type: Boolean, default: false },
  requestedDeactivationComment:{
    type: String
  },
  defaultPermissionLevel: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signUpUsers" || "addSociety",
  },
  society_id: {
    type: String,
  },
  checkInTime: Date,
  checkoutTime: {
    type: Date,
    default: null,
  },
  Ownerimage: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
    trim: true,
  },

  defaultPermissionLevel: {
    type: Number,
  },
  rwaImages: {
    type: String,
  },
  rwaDocuments: {
    type: Object,
  },
});

module.exports = mongoose.model("signUpUsers", signUpSchema);
