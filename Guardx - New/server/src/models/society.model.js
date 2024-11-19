import mongoose from "mongoose";

const societySchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    },
    societyLogo:{
        type:String,

    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    SocietyImage:{
        type:String,
    },
    registrationNumber:{
        type:String,
    },
    affiliateId:{
        type:String,
    },
    SocietyDocuments:{
        type:[]
    },
    houseCount:{
        type:Number,
        required:true,
    } ,
    typeOfEntries:{
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "EntryList",
          },],
    }

},{timestamps:true});

export const Society =new mongoose.model('Society',societySchema) 