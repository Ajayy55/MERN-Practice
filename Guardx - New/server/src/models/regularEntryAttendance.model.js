import mongoose from 'mongoose';

const regularEntriesAttendanceSchema = new mongoose.Schema(
  {
    regularEntryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegularEntry", 
      required: true,
    },
    guardID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true, 
    },
    society:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society", 
      required: true, 
    },
    clockInTime: {
      type: Date,
      default: Date.now, 
      required: true,
    },
    clockOutTime: {
      type: Date, 
    },
  },
  {
    timestamps: true, 
  }
);

export const RegularEntriesAttendance = mongoose.model(
  "RegularEntriesAttendance",
  regularEntriesAttendanceSchema
);
