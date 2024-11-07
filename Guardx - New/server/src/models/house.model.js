import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const houseSchema=new mongoose.Schema({
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