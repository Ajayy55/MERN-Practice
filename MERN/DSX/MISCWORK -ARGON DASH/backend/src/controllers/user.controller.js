import { readData, writeData } from "../utils/fileHandling.js";
import { genrateID } from "../utils/generateUserID.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt.js";
const DATA_FILE='./src/db/userDb.json'

const registerUser=async(req,res)=>{
    const items = readData(DATA_FILE);
    const newItem = req.body;

    if (
        !newItem.username ||
        !newItem.email ||
        !newItem.mobile ||
        !newItem.password ||
        !newItem.gender
      ) {
        return res.status(400).json({ message: "all fields required" });
      }


    try {
        //chk email
        const checkUserEmail=items.find((record)=>record.email===newItem.email)
        if(checkUserEmail){ return res.status(400).json({ message: "email already registered" });}

        //chk mobile
        const checkUserMobile=items.find((record)=>record.mobile===newItem.mobile)
        if(checkUserMobile){ return res.status(400).json({ message: "mobile already registered" });}
        
        //hashed pass
        const hashedPassword = await bcrypt.hash(newItem.password, 10);
        if(hashedPassword){newItem.password=hashedPassword}

        //GEN uSER ID
        const userdID=genrateID();
        newItem.id=userdID;

        items.push(newItem);
        writeData(DATA_FILE,items);
        res.status(201).json({message:'User registered successfully ...!',newItem})
    

    } catch (error) {
       console.log('server error while signup',error);
       res.status(500).json({message:'error while signup user'})
    }
}


const userLogin =async(req,res)=>{
    const { email, password } = req.body;
    const items=readData(DATA_FILE);
    //check user data
    if (!email || !password) {
    return res.status(400).json({ message: "all fields required" });
    }

    try {
          //chk email
          const user=items.find((record)=>record.email===email)
          if(!user){ return res.status(400).json({ message: "email not found" });}        

          //check passwrod
          const ispasswordMatched=await bcrypt.compare(password,user.password)
          if(!ispasswordMatched){return res.status(400).json({ message: "password not matched" });}   

          //gen Token
          const payload = {
            id:user.id,    
            username: user.username,
            email:user.email
        };

        const Token=await generateToken(payload);
        if (!Token) {return res.status(500).json({ message: "Token Generation failed..!" });}

        //response
        res.status(200).json({ message: "Login successfully ", Token});

    } catch (error) {
        console.log('server error while Login',error);
        res.status(500).json({message:'Server error while login'})
    }
}


const userProfile=async(req,res)=>{
    const id=req.params.id;
    const items=readData(DATA_FILE);

    const user= items.find((record)=>{return record.id === id})
    if(!user){ return res.status(400).json({ message: "no user record found" });}        

    res.status(200).json(user)
}

const setProfilePicture =async(req,res)=>{
    const id=req.params.id;
    let file='http://localhost:4000/userProfiles/'
    file +=req?.file?.filename;

    
    const items=readData(DATA_FILE);

    const user= items.find((record)=>{return record.id === id})
    if(!user){ return res.status(400).json({ message: "no user profile image found" });}

    const index=items.findIndex((record)=> record.id=== id)

    items[index].profile=file

    console.log(items[index]);
    
    console.log(user,'\n',index);

    writeData(DATA_FILE,items);
    res.status(200).json('updated')
    
}



export {registerUser,userLogin,userProfile,setProfilePicture}