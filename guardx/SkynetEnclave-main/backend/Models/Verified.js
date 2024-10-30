const mongoose = require("mongoose");

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  return `${date}-${month}-${year}`;
};
// hello
const userSchema = new mongoose.Schema({
  maidName: {
    type: String,
    trim: true,
  },
  parentId: {
    type: String,
  },
  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signupusers",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "enrtySchema",
  },
  society_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addSociety",
  },
  submittedDate: {
    type: String,
    default: getCurrentDate,
    immutable: true,
  },
  clockInTime: {
    type: String,
  },
  clockOutTime: {
    type: String,
  },
});

userSchema.path("submittedDate").immutable(true);
userSchema.path("clockInTime").immutable(true);

module.exports = mongoose.model("verifiedusers", userSchema);
