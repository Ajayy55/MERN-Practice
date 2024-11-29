import mongoose, { mongo } from "mongoose";
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(
  2,
  "0"
);
const day = String(currentDate.getDate()).padStart(2, "0");
const memberSessionSchema=new mongoose.Schema({
    memberId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      societyId: {
        type: String
      },
      clockInTime: {
        type: Date,
        default: Date.now, 
        required: true,
      },
      date: {
        type: String,
        default: `${day}/${month}/${year}`
      },
      clockOutTime: {
        type: String,
    
      },
      ipAddress: {
        type: String, 
      },
      deviceDetails: {
        type: String, 
      },


},{timestamps:true});


export const MemberSession=new mongoose.model("MemberSession",memberSessionSchema);