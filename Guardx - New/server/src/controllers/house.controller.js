import { House } from "../models/house.model.js";
import fs from 'fs';
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
    // console.log(req.body);
    
    if(!houseNo|| !blockNo){
      return res.status(400).json({message:'All fields required'});
    }

try {
     const checkHouseExist = await House.findOne({ houseNo,blockNo, societyId });
      console.log(checkHouseExist);
      
      if(checkHouseExist){
        return res.status(400).json({message:'House No of Block already assigned'});
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

const handleApprovalStatus=async(req,res)=>{
  const {houseId,approvalStatus}=req.body;
  console.log(req.body);
  
  if(!houseId ||!approvalStatus){
    return res.status(400).json({message:'All fields required'});
  }
try {
  
    const house = await House.findById(houseId) ;
    if(!house){
      return res.status(404).json({message:"No House Record Found"})
    } 
    
    house.approvalStatus=approvalStatus;
    const status=house.save()
    if(status){
      res.status(200).json({message:'Approval Status Updated ..!'})
    }else{
     return res.status(200).json({message:'Something went Wrong while  Updated Status..!'})

    }
} catch (error) {
  console.log('Error while updating approval Status House List', error);
  return res.status(500).json({ message: 'Internal server error while updating approval Status House List' });
}

}

const removeHouse=async(req,res)=>{
  const houseId=req.params.id;

  try {
    
    const response=await House.findByIdAndDelete(houseId)
    if(!response){
      return res.status(404).json({message:"Something Went wrong while Removing house"})
    }

    res.status(200).json({message:'House record removed !'})
  } catch (error) {
    console.log('Error while Removing House ', error);
  return res.status(500).json({ message: 'Internal server error while Removing House ' });
  }

}

const editHouse=async(req,res)=>{
  const {email,mobile,ownerName,houseNo,blockNo,aadhaarNumber,houseId}=req.body;
  const files = req.files;
console.log(req.body,files.aadhaarImage);

  if(!email|| !mobile|| !ownerName|| !houseNo|| !blockNo|| !aadhaarNumber || !houseId){
    return res.status(400).json({message:'All fields required'});
  }

  try {

    const response = await House.findByIdAndUpdate(houseId,{...req.body},{new:true});

    if(!response){
      return res.status(404).json({message:"No House Record Found to Update"})
    } 
    if (files) {
      if (files.ownerImage && files.ownerImage[0]) {
        // fs.unlink(response.ownerImage, (err) => {
        //   if (err) {
        //     console.error("Failed to delete the old icon: ", err);
        //   } else {
        //     console.log("Old icon deleted successfully");
        //   }
        // });
        response.ownerImage = files.ownerImage[0].path;  
      }
      if (files.aadhaarImage && files.aadhaarImage[0]) {
        // fs.unlink(response.aadhaarImage, (err) => {
        //   if (err) {
        //     console.error("Failed to delete the old icon: ", err);
        //   } else {
        //     console.log("Old icon deleted successfully");
        //   }
        // });
        response.aadhaarImage = files.aadhaarImage[0].path;  
      }
    }

    await response.save();
    res.json({message:'house Updated'})

  } catch (error) {
    console.log('Error while updating House ', error);
    return res.status(500).json({ message: 'Internal server error while updating House ' });
  }


}

export {registerHouse,addHouseByAdmin,getHouseListBySocietyId,handleApprovalStatus,removeHouse,editHouse}