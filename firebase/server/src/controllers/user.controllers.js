const User =require("../models/user.model");
const bcrypt = require('bcrypt');
const genToken = require("../utils/JWT");
const admin = require('./../../firebaseAdmin')

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
        console.log(isUserExisted);
        
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
    console.log(FCM_Token);
    
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

      res.status(200).json({ message: "Login Successfully", Token });
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

const sendPushNotification =async(req,res)=>{

  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };
  
  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).send({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ success: false, error: error.message });
  }
}

module.exports={registerUser,loginUser,SignInWithGoogle,sendPushNotification}