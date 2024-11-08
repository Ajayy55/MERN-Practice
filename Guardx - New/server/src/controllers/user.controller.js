import { House } from "../models/house.model.js";
import { Role } from "../models/roles.model.js";
import { User } from "../models/user.model.js";
import { GenJwtToken } from "../utils/JWT.js";

const createSuperAdmin=async(req,res)=>{
    const { email, mobile, password,role,permissionLevel} = req.body;
    console.log( email, mobile, password,permissionLevel);
    
    if (!email || !mobile || !password ||!permissionLevel) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      try {
        const isSuperAdminExisted=await Role.findOne({ title: "superAdmin" })
        if (isSuperAdminExisted) {
            return res.status(400).json({ message: 'Super Admin already existed' });
          }

        const isUserExisted = await User.findOne({ email });
        if (isUserExisted) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
    
        const isMobileExisted = await User.findOne({ mobile });
        if (isMobileExisted) {
          return res.status(400).json({ message: 'User with this mobile already exists' });
        }

        const newUser = new User({ ...req.body });
        const response = await newUser.save();

        if (!response) {
            return res.status(500).json({ message: 'An error occured while creating Super Admin' });
          }
          
         const initialModules = [
            { moduleName: "Society List", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Regular Entries", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Guest Entries", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Type of Entries", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Purpose of Occasional", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "House List", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Attendance", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Announcements", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Complaints", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Users", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Roles", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
            { moduleName: "Public access", actions: ["Module", "Create", "Read", "Edit", "Delete"] },
          // Add more modules as needed
        ];

          const isRoleCreated=await Role.create({
            title:"superAdmin",
            desc:"superAdmin",
            permissionLevel,
            createdBy:response._id,
            roleType:"saas",
            permissions:initialModules
          })

          console.log(isRoleCreated);
          response.role=isRoleCreated._id;
          await  response.save();
          res.status(201).json({message:'Super Admin Created ..!'})
          
      } catch (error) {
        console.log('Error while registering user', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
}

const registerUser = async (req, res) => {
  const { email, mobile, password } = req.body;
  const files = req.files;

  if (!email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user exists by email or mobile
    const isUserExisted = await User.findOne({ email });
    if (isUserExisted) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const isMobileExisted = await User.findOne({ mobile });
    if (isMobileExisted) {
      return res.status(400).json({ message: 'User with this mobile already exists' });
    }

    // Create user without files
    const newUser = new User({ ...req.body });

    if (files) {
      if (files.rwaImage && files.rwaImage[0]) {
        newUser.rwaImage = files.rwaImage[0].path;  
      }
      if (files.rwaDocument && files.rwaDocument[0]) {
        newUser.rwaDocument = files.rwaDocument[0].path;  
      }
    }

    // Save the new user document with file data
    const response = await newUser.save();

    res.status(201).json(response);

  } catch (error) {
    console.log('Error while registering user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login=async(req,res)=>{
    const {email,password}=req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
try {
  
      const user=await User.findOne({$or:[{email:email},{mobile:email}]})
                || await House.findOne({$or:[{email:email},{mobile:email}]})
      if (!user) {
          return res.status(400).json({ message: 'Invalid Email or Mobile' });
        }
      
  
      const matchPassword=await user.isPasswordMatched(password);
      if (!matchPassword) {
              return res.status(400).json({ message: 'Entered wrong password' });
        }
        
      const payload={
          id:user._id,
          email:user.email,
          username:user.username,
      }
      const jwtToken=await GenJwtToken(payload);
      if (!jwtToken) {
        return res.status(400).json({ message: 'An error occured while generating security Token' });
      }

       res.status(200).json({message:'log in successful',jwtToken,user})
} catch (error) {
  console.log('Error while login user', error);
  return res.status(500).json({ message: 'Internal server error while login' });
}
    
}

const getPemissions=async(req,res)=>{
  const {id}=req.body;
  
  try {
      const userRoles=await User.findById(id).populate({path:"role"}).select("-password")

      if (!userRoles) {
        return res.status(400).json({ message: 'No Role assigned to you, plscontact Admin' });
      }

      res.send(userRoles)
      
  } catch (error) {
    console.log('Error while getting permissions', error);
    return res.status(500).json({ message: 'Internal server error while fetch permissions' }); 
  }

}

export { createSuperAdmin,registerUser,login,getPemissions };
