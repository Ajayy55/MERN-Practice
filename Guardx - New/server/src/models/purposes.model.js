import mongoose from "mongoose";

const purposeSchema=new mongoose.Schema({
    purpose:{
        type:String,
        required:true,
    },
    purposeIcon:{
        type:String,
    },
    purposeType:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

    
},{timestamps :true})

export const Purpose=new mongoose.model("Purpose",purposeSchema);