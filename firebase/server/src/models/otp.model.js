const mongoose= require ('mongoose')

const otpSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 305, // 300 seconds = 5 minutes
    },
});
// otpSchema.index({ user: 1 }, { unique: true });

const OTP=new mongoose.model("OTP",otpSchema);

module.exports=OTP;