import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    mobile:{
        type:String,
        required:true,
        
    },
    username:{
        type:String,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    requestDeactivation:{
        type:Boolean,
        default:false
    },
    requestDeactivationMSg:{
        type:String,
    },
    createdBy :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" || "Society" 
    },
    societyId:{
        type:String,
    },
    rwaImage:{
        type:String,
    },
    rwaDocument:{
        type:Object,
    },
    role:{
        type:String,
        enum:["superAdmin", "admin" , "societyAdmin","societySubAdmin","guardLevel"],
        required:true,
    },
    permissionLevel:{
        type:Number,
        default:2
    }

},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified('password'))return next();

    this.password=await bcrypt.hash(this.password,10) 
    next();
})

userSchema.methods.isPasswordMatched=async function(password){
    return await bcrypt.compare(password,this.password);
}

export const User=new mongoose.model('User',userSchema);