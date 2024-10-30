const mongoose = require("mongoose");
// hello 12july
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

const societySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  societyContactNumber: {
    type: String,
  },
  alternateNumber: {
    type: String,
  },
  secretaryName: {
    type: String,
  },
  secretaryContact: {
    type: String,
  },
  secretaryPhoto: {
    type: Object,
  },
  secretaryDetails: {
    type: Object,
  },
  ownerName: {
    type: String,
  },
  userPhoneNo: {
    type: String,
  },
  password: {
    type: String,
  },

  username: {
    type: String,
  },
  societyLogo: {
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signUpUsers",
  },
  parentId: {
    type: String,
  },
  defaultPermissionLevel: {
    type: Number,
    default: 4,
  },
  role: {
    type: String,
    default: "Society Admin",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  Ownerimage: {
    type: String,
    default: null,
  },
  societyImages: {
    type: Object,
  },
  societyRegistration: {
    type: String,
  },
  societyHouseList: {
    type: String,
  },
  superAdminContactNo: {
    type: String,
  },
  superAdminName: {
    type: String,
  },
  superAdminDocument: {
    type: Object,
  },
  superAdminPhoto: {
    type: Object,
  },
  media: [
    {
      path: String,
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
    },
  ],
  societyDocuments: [
    {
      path: {
        type: String,
        required: true,
      },
      type: {
        type: String, // e.g., "image", "pdf", "doc"
        enum: ["image", "video", "pdf", "doc", "document"],
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  state: {
    type: String,
  },
  city: {
    type: String,
  },
});

societySchema.path("submitedTime").immutable(true);
societySchema.path("submitedDate").immutable(true);
module.exports = mongoose.model("addSociety", societySchema);
