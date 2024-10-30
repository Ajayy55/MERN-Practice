const mongoose = require("mongoose");
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(
  2,
  "0"
);
const day = String(currentDate.getDate()).padStart(2, "0");
const guardInOutSchema = new mongoose.Schema({
  guardId: {
    type: String
  },
  societyId: {
    type: String
  },
  clockInTime: {
    type: String,
  },
  date: {
    type: String,
    default: `${day}/${month}/${year}`
  },
  clockOutTime: {
    type: String,

  },
  createdBy: {
    type: String,
  }
});

module.exports = mongoose.model("GuardInout", guardInOutSchema);


