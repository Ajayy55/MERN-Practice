const mongoose = require('mongoose');
const PermissionSchema = new mongoose.Schema({
    moduleName: { type: String, required: true },
    actions: { type: [String], required: true }
});

const roleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    permissions: { type: [PermissionSchema], required: true },
    defaultPermissionLevel: { type: Number },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"signUpUsers"||"addSociety"
      },
      roleTypeLevelSociety:{
        type: String
      }
});
module.exports = mongoose.model('role', roleSchema);