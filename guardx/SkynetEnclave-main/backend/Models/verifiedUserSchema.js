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
  console.log(ISTTime);
  return `${ISTTime}`;
};

const userSchema = new mongoose.Schema({
  houseMaidHindi: {
    type: String,
    // required: true,
  },
  houseMaidEnglish: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  aadharNumber: {
    type: String,
  },
  paramsId: {
    type: String,
  },
  image: {
    type: Object,
  },
  aadharImage: {
    type: Object,
  },
  optionalImage: {
    type: Object,
  },
  submitedDate: {
    type: String,
    default: getCurrentDate,
  },
  submitedTime: {
    type: String,
    default: getCurrentTime,
  },
  clockoutTime: {
    type: String,
  },
  houseSelect: [
    {
      houseNo: { type: String, required: true },
      houseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "housedeatils",
        required: true,
      },
    },
  ],
});
// Middleware to update submitedDate and submitedTime before saving
userSchema.pre("save", function (next) {
  console.log("Updating submitedDate and submitedTime...");
  this.submitedDate = getCurrentDate();
  this.submitedTime = getCurrentTime();
  console.log("submitedDate:", this.submitedDate);
  console.log("submitedTime:", this.submitedTime);
  next();
});

// Mark submitedTime and submitedDate as immutable
userSchema.path("submitedTime").immutable(true);
userSchema.path("submitedDate").immutable(true);

module.exports = mongoose.model("regularData", userSchema);
