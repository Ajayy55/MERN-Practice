import useragent from 'useragent'
import { RegularEntriesAttendance } from '../models/regularEntryAttendance.model.js';

const memberSession =(req,res)=>{
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgentString = req.headers['user-agent'];
    const agent =useragent.parse(userAgentString)
    const normalizedIP = ip === "::1" ? "127.0.0.1" : ip;
    console.log("User IP Address:", normalizedIP,'\n',agent.family,agent.os.family);

    res.send({normalizedIP,browser:agent.family,os:agent.os.family})

}

const handleRegularEntryClockIn=async(req,res)=>{
    const {regularEntryID,guardID,society}=req.body;
    
    if(!regularEntryID||!guardID||!society){
        return res.status(400).json({message:'Regular Entry Id or Gurad Id Society Id Required'});
    }   
try {
    
        const checkClockedInAgain=await RegularEntriesAttendance.findOne({regularEntryID,society}).sort({ createdAt: -1 })
    // console.log(checkClockedInAgain);
        if(checkClockedInAgain && !checkClockedInAgain.clockOutTime){
            
            checkClockedInAgain.clockOutTime=Date.now();
            await checkClockedInAgain.save();
         }
        
        const response=await RegularEntriesAttendance.create(req.body);
    
        if(!response){
            return res.status(500).json({message:'Something went wrong while saving entry record'});
        }
    
        res.status(200).json({message:'success Entry Saved'}) 
} catch (error) {
    console.log(error,'Internal server error while Clock in regular entry');
    res.status(500).json({message:"Internal server error while Clock in regular entry"})
    
} 
}


const handleRegularEntryClockOut=async(req,res)=>{
    const {regularEntryID,society}=req.body;

    if(!regularEntryID || !society){
        return res.status(400).json({message:'Regular Entry Id/ Society ID Required'});
    }   
 try {
       
       const response=await RegularEntriesAttendance.findOne({regularEntryID,society}).sort({ createdAt: -1 })
    //    console.log(response);
       
       if(!response){
           return res.status(500).json({message:'No Record Found'});
       }
   
       if(!response.clockOutTime){
           console.log(response);
           response.clockOutTime=Date.now();
           await response.save();
       }
       res.status(200).json({message:"success"})
 } catch (error) {
    console.log(error,'Internal server error while Clock out regular entry');
    res.status(500).json({message:"Internal server error while Clock out regular entry"})
 }
}

const viewRegularEntryAttendance=async(req,res)=>{
    const {regularEntryID,society}=req.body;
    if(!regularEntryID || !society){
        return res.status(400).json({message:'Regular Entry Id/ Society ID Required'});
    }  

    try {
        const response=await RegularEntriesAttendance.find({regularEntryID,society}).sort({ createdAt: -1 }).populate("regularEntryID","name")
        // console.log(response);
        
        if(!response){
            return res.status(500).json({message:'No Record Found'});
        }

        res.status(200).json({message:'success',response})
    } catch (error) {
        console.log(error,'Internal server error while getting regular entry');
    res.status(500).json({message:"Internal server error while gettingregular entry"})
    }

}

export {memberSession,
    handleRegularEntryClockIn,
    handleRegularEntryClockOut,
    viewRegularEntryAttendance,
}