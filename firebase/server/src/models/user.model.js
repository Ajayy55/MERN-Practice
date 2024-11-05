const mongoose= require ('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true  
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
       
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
    },
    gender :{
        type :String,
        enum:['male','female','other'],
    },Token:{
        type:String
    },
    uid :{
        type:String,
        unique:true,
    },
    photoURL:{
        type:String,
    },
    FCM_Token:{
        type:String
    },
    role:{
        type: String,
    enum:['user','admin'],
    default:'user'
    }
},{timestamps:true});

const User=new mongoose.model('User',userSchema);

module.exports=User;