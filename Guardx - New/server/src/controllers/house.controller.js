import { House } from "../models/house.model.js";

const registerHouse=async(req,res)=>{
    const { email, mobile, password } = req.body;
    const files = req.files;
  
    if (!email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists by email or mobile
        const isUserExisted = await House.findOne({ email });
        if (isUserExisted) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
    
        const isMobileExisted = await House.findOne({ mobile });
        if (isMobileExisted) {
          return res.status(400).json({ message: 'User with this mobile already exists' });
        }
    
        // Create user without files
        const newUser = new House({ ...req.body });
        const response = await newUser.save();


        res.status(201).json(response);
    }
    catch (error) {
        console.log('Error while registering user', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

}



export {registerHouse}