const User =require("../models/user.model");
const bcrypt = require('bcrypt');
const genToken = require("../utils/JWT");
const OTP = require("../models/otp.model");

const registerUser =async(req,res)=>{

    const {email,password,username,mobile,gender,address} =req.body;
    
    if (!email|| !password|| !username|| !mobile|| !gender){
        return res.status(401).json({message:'Please fill all Fields'})
    }
try {
    
        //chk email pass existence
        const isUserExisted = await User.findOne({
            $or: [{ email }, { mobile }]
        });
        
        if(isUserExisted){
            return res.status(401).json({message:'email or mobile number already existed in our DB'})
        }
    
        //hash password
        const hashedPassword= await bcrypt.hash(password,10)
    
        const response= await User.create({
            email,
            username,
            password:hashedPassword,
            mobile,
            gender
        })
    
        if (!response) {
            return res
              .status(500)
              .json({ message: "An Error Occured while register User" });
          }
    
        res.status(201).json({message:'Signup Successfully ..!',response})
          
} catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error while registering",
      er: error?.errorResponse?.errmsg,
    });
}
}

const loginUser = async (req, res) => {
    const { email, password ,FCM_Token} = req.body;
    // console.log(FCM_Token);
    
    //check user data
    if (!email || !password) {
      return res.status(400).json({ message: "all fields required" });
    }
    try {
      //find email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "user email not existed in DB" });
      }
  
      //chk password
      const checkPassword = await bcrypt.compare(password, user.password);
  
      if (!checkPassword) {
        return res.status(400).json({ message: "wrong password entered" });
      }
  
      //generate token
      const payload = {
        id: user._id,
        username: user.username,
        pass: user.email,
      };
      const Token = await genToken(payload);
    //   console.log(Token);

      user.Token=Token;
      user.FCM_Token=FCM_Token;
      await user.save()

      res.status(200).json({ message: "Login Successfully", Token,id:user._id});
    } catch (error) {
      console.log("Internal server error while login", error);
      res.status(500).json({ message: "Internal server error while Loging" });
    }
  };

const SignInWithGoogle=async(req,res)=>{
  const { uid, email, username, photoURL,FCM_Token } = req.body;

  try {
    let user = await User.findOne({ uid });

    // If user does not exist, create a new record
    if (!user) {
      user = new User({ uid, email, username, photoURL });
      await user.save();
    }

    user.FCM_Token=FCM_Token;
    await user.save();

    res.status(200).json({ message: 'User logged in successfully', user });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

const validateOTP=async(req,res)=>{
    const UserId=req.params.id || '6728902f0e42e3927cf4c421' ;
    const {otp}=req.body ;

    try {
      const DbRecord=await OTP.findOne({user:UserId})
      if(!DbRecord){
        return res.status(400).json({ message  : 'OTP Expired Please Try Again' }); 
      }
      
      if(DbRecord.otp!==otp){
        return res.status(400).json({ message  : 'OTP Not Matched' }); 
      }
      
      res.status(200).json({ message  : 'OTP Matched' }); 
    } catch (error) {
      console.error('Error while validate otp:', error);
     res.status(500).json({ error: 'Internal server error ' }); 
    }
}

const ResetPassword=async(req,res)=>{
  const {userId,NewPassword}=req.body;

  try {
      const user=await User.findOne({_id:userId})

      if(!user){
        return res.status(400).json({ message  : 'User not Found' }); 
      }

      const HashedPassword =await bcrypt.hash(NewPassword,10);

      user.password=HashedPassword;
      user.save();

      res.status(200).json({message:'password changed successfully'})

  } catch (error) {
    console.error('Error while reset password:', error);
    res.status(500).json({ error: 'Internal server error while reset password' }); 
   }
  }






module.exports={registerUser,loginUser,SignInWithGoogle,validateOTP,ResetPassword}