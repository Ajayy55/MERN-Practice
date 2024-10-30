const mongoose = require("mongoose");
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
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
  entryType: {
    type: String,
    // required: true,
    trim: true,
  },
  purposeType: {
    type: String,
    // required: true,
    trim: true,
  },
  houseDetails: {
    type: Object,
    // required: true,
    trim: true,
  },
  adharImg: {
    type: Object,
    // required: true,
    trim: true,
  },
  image: {
    type: Object,
    // required: true,
    // trim: true
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  aadhaarNumber: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  society_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addSociety",
  },
  guardId: {
    type: String,
  },
  submitedDate: {
    type: String,
    default: getCurrentDate,
  },
  submitedTime: {
    type: String,
    default: getCurrentTime,
  },
  clockOut: {
    type: String,
    default:null
  },
  house_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "housedeatils",
  }
});
userSchema.path("submitedTime").immutable(true);
userSchema.path("submitedDate").immutable(true);
module.exports = mongoose.model("nonVerify", userSchema);
