const OTP = require("../models/otp.model.js");
const User = require("../models/user.model.js");
const admin = require("./../../firebaseAdmin.js");

const sendPushNotification = async (req, res) => {
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
    console.log("Successfully sent message:", response);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const StaffLoginNotifyAdmin = async (req, res) => {
  const { staffId } = req.body;

  try {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      return res.status(400).send({ message: "No admin found" });
    }

    // const adminFCM=;
    const staff = await User.findOne({ _id: staffId });
    if (!staff) {
      return res.status(400).json({ message: "Staff details not found" });
    }
    const date=new Date();
    const message = {
      notification: {
        title: `Staff Logged In ${date.toLocaleString()}`,
        body: `\nHey Admin your One of Staff Member\nnamed ${staff.username}\nEmail ${staff.email}\nJust Logged into the System`,
      },
      token: `${adminUser.FCM_Token}`,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent Login message to admin :", response);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } catch (error) {
    console.log("An error occured while staff login notifying to admin", error);
    res
      .status(500)
      .json({
        message: "Internal server error while staff login notifying admin ",
      });
  }
};

const SendOTPNotification =async(req,res)=>{
    const {email}=req.body;
    const date=new Date();
    
    try {
        const user=await User.findOne({email})
    
        if(!user){
             res.status(400).send({ message: "No Matched Email found" });
             return false;
        }
        const otp= Math.ceil(Math.random()*1000)+1000;
      
        try {
            const Ot = new OTP({user:user._id,otp:otp});
            await Ot.save();
        } catch (error) {
            return res.status(400).json({message:'OTP already generated pls use previous or wait for sometime'})
        }
         
         const message = {
                  notification: {
                    title: `Password Reset Request ${date.toLocaleString()}`,
                    body: `\nYour OTP for resetting the password is: ${otp}. \nThis code is valid for 5 minutes. \nDo not share this OTP with anyone.`,
                  },
                  token: `${user.FCM_Token}`,
                };
                try {
                  const response = await admin.messaging().send(message);
                  console.log("OTP message Successfully sent :", response);
                  res.status(200).json({message:'OTP sent successfully'})
                } catch (error) {
                  console.error("Error sending message:", error);
                  res.status(500).json({ success: false, error: error.message });
                }

    } catch (error) {

        console.log(error,'an error occured while generatin OTP');
        res.status(500).json({ message: "Internal Server error" });
    }


   
    
    // if(!isOTPsaved){
    //     return res.status(401).json({message:'Email not found '})
    // }else {
    //     res.status(200).json({message:'OTP saved'})

       
    // 
    // }
}

module.exports = { sendPushNotification, StaffLoginNotifyAdmin,SendOTPNotification };
