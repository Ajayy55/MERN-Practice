import mongoose from "mongoose";
const PermissionSchema = new mongoose.Schema({
    moduleName: { type: String, required: true },
    actions: { type: [String], required: true }
});
const roleSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    permissionLevel:{
        type:Number,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    roleType:{
        type:String,
        enum:["saas","society","subSociety","guardAccess"]
    },
    permissions:{
        type: [PermissionSchema],
        required:true,
    }


},{timestamps:true});

export const Role=new mongoose.model('Role',roleSchema);