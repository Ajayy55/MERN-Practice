const mongoose = require("mongoose");

const houseSchema = mongoose.Schema({
  houseNo: {
    type: String,
    trim: true,
  },
  ownerName: {
    type: String,
    trim: true,
  },
  ownerNameHindi: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  userPhoneNo: {
    type: String,
    trim: true,
  },
  alternateContact: {
    type: String,
    trim: true,
  },
  vehicleInfo: {
    type: String,
    trim: true,
  },
  blockNumber: {
    type: String,
    trim: true,
  },
  aadhaarNumber: {
    type: String,
    trim: true,
  },
  ownerImages: {
    type: [String],
    trim: true,
  },
  houseIcon: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signUpUsers" || "addSociety",
  },
  society_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addSociety",
  },
  defaultPermissionLevel: {
    type: Number,
    default: 3,
  },
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  vehicles: {
    type: Object,
  },
  isRwaMember: {
    type: String,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signUpUsers",
  },
  isEmailSent: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("housedeatils", houseSchema);
