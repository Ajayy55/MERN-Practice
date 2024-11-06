import mongoose from "mongoose";

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
        enum:["saas","society","societyLevel","guardAccess"]
    }


},{timestamps:true});

export const Role=new mongoose.model('Role',roleSchema);