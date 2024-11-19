import mongoose from "mongoose";

const entryListSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },
    icon:{
        type:String,
    },
    entryType:{
        type:String,
        enum:['regular','occasional']
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const EntryList=new mongoose.model("EntryList",entryListSchema)