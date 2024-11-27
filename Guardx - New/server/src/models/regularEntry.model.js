import mongoose from 'mongoose'

const regularProfileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female","other"],
        default:"male"
    },
    address:{
        type:String,
        required:true,
    },
    aadhaarNumber: {
        type: String,
        match: /^[0-9]{12}$/, // Regular expression to allow only 12 digits
        validate: {
            validator: function (value) {
                return /^[0-9]{12}$/.test(value); // Ensures it's exactly 12 digits
            },
            message: "Aadhaar Number must be exactly 12 digits long and contain only numbers."
        },
        unique:true,
    },
    entry:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"EntryList",
        required:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    regularProfileImage:{
        type:String,
        required:true,
    }
    ,
    regularAadharImage:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps:true});

export const RegularEntry=new mongoose.model("RegularEntry",regularProfileSchema);