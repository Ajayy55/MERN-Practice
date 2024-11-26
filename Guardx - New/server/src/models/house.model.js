import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const vehicleSchema=new mongoose.Schema({
    vehicleType:{
        type:String,
    },
    vehicleNumber:{
        type:String,
    },
    vehicleImage:{
        type:[String], 
    }
})

const houseSchema=new mongoose.Schema({
    email:{
        type:String,
        // required:true,
        lowercase:true,
    },
    mobile:{
        type:String,
        // required:true,
    },
    ownerName:{
        type:String,
        lowercase:true
    },
    password:{
        type:String,
        // required:true,
    },
    houseNo:{
        type:String,
        required:true,
    },blockNo:{
        type:String,
        required:true,
    },
    ownerImage:{
        type:String,
    },
    vehicles:{
        type:[vehicleSchema],
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    societyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Society"
    },
    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    approvalStatus:{
        type:String,
        enum:["Approved","Pending","Rejected"],
        default:"Pending"
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
    },
    aadhaarImage:{
        type:String,
    },
    isRwaMember:{
        type:Boolean,
        default:false,  
    },
    role:{
        type:String,
        default:"Public"
    },
    permissionLevel:{
        type:Number,
        default:6    
    },updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
},{timestamps:true});

houseSchema.pre("save",async function(next){
    if(!this.isModified('password'))return next();

    this.password=await bcrypt.hash(this.password,10) 
    next();
})

houseSchema.methods.isPasswordMatched=async function(password){``    
    return await bcrypt.compare(password,this.password);
}

export const House = new mongoose.model('House',houseSchema)