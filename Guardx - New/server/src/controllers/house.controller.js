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

const addHouseByAdmin=async(req,res)=>{
    const {houseNo,blockNo,createdBy,societyId} =req.body;

    if(!houseNo|| !blockNo){
      return res.status(400).json({message:'All fields required'});
    }

try {
     const checkHouseExist = await House.findOne({ houseNo, societyId });
      console.log(checkHouseExist);
      
      if(checkHouseExist){
        return res.status(400).json({message:'House No already assigned'});
      }
      const payload={
        ...req.body,
      }
      console.log(payload);
      
      const response= await House.create(payload)
      if(!response){
        return res.status(400).json({message:'Something went wrong while adding House'});
      }

      res.status(201).json({message:'House Successfully Added..!'})
  
} catch (error) {
  console.log('Error while registering user adding House', error);
  return res.status(500).json({ message: 'Internal server error while adding House' });
}
}

const getHouseListBySocietyId=async(req,res)=>{
  const societyId =req.params.id;

  try {

    const response=await House.find({societyId})
    if(!response){
      return res.status(400).json({message:'Empty Houslist'});
    }
    
    res.status(200).json({message:'Society List : ',response})
  } catch (error) {
    console.log('Error while registering user Getting House List', error);
    return res.status(500).json({ message: 'Internal server error while getting House List' });
  }


}



export {registerHouse,addHouseByAdmin,getHouseListBySocietyId}