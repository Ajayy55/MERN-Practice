import { Purpose } from "../models/purposes.model.js";
import fs from 'fs';
import path from 'path';
import { Society } from "../models/society.model.js";
import mongoose from "mongoose";
import { log } from "console";

const addPurpose=async(req,res)=>{
    // console.log(req.body);
    
    const {purpose,purposeType,createdBy}=req.body;
    const icon=req.files;

    if(!purpose ||!purposeType || !createdBy){
        return res.status(400).json({message:'All fields Required'});
    }
try {
    
        const ispurposeExists =await Purpose.findOne({purpose})
        if(ispurposeExists){
            return res.status(400).json({message:'Purpose with same name already Exists'});
        }  
    
        const newPurpose= new Purpose({...req.body})
    
        if(icon){
            if(icon.purposeIcon[0])
            {
                newPurpose.purposeIcon=icon.purposeIcon[0]?.path 
            }else{
                console.log('failed to save icon image');
                
            }
        }
    
        const response=await newPurpose.save()
        if(!response)
        {
            res.status(500).json({message:'Something Went wrong while adding Type of Entry'})
        }

        res.status(201).json({message:'Types of Entry Added ..!',response})
} catch (error) {
    console.log('Internal server error while Adding Type of Entry : ',error);
    res.status(500).json({message:'Internal server error while adding type of entry'})
    
}  

}

const getAllPurposes=async(req,res)=>{
     
   try {
    const response=await Purpose.find({})
    if(!response){
       return res.status(500).json({message:'Something Went wrong Purpose Not Found'})
    }

    res.status(200).json({message:'Purpose List :',response})


  } catch (error) {
   console.log('Internal server error while geting Type of Entry : ',error);
   res.status(500).json({message:'Internal server error while geting type of entry'})
  }
}

const removePurpose=async(req,res)=>{
    const id=req.params.id;
    // console.log(id);
    
   try {
     const response=await Purpose.findByIdAndDelete(id)
     if(!response){
        return res.status(500).json({message:'Something Went wrong while Removing Purpose'})
     }

     res.status(200).json({message:'Entry Removed Successfully',response})


   } catch (error) {
    console.log('Internal server error while removing Type of Entry : ',error);
    res.status(500).json({message:'Internal server error while removing type of Purpose'})
   } 

}

const editPurpose=async(req,res)=>{
    const {purpose_id}=req.body;
    const icon=req.files;
    // console.log(req.body);
    
    const {purpose,purposeType,createdBy}=req.body;
 
    if(!purpose  || !createdBy){
        return res.status(400).json({message:'All fields Required'});
    }

   try {
     const purpose=await Purpose.findOne({_id:purpose_id})
    //  console.log(entry);
     
     if(!purpose){
        return res.status(400).json({message:'purpose not Found in Db'})
     }

     const response=await Purpose.findByIdAndUpdate(purpose_id,req.body,{new:true})
     if(!purpose){
        return res.status(500).json({message:'Something went wrong while updating Entry'})
     }

     if(icon){
       
        
        if(Object.keys(icon).length >0 && icon.purposeIcon[0])
        {   
          
            fs.unlink(purpose.purposeIcon, (err) => {
              if (err) {
                console.error("Failed to delete the old icon: ", err);
              } else {
                console.log("Old icon deleted successfully");
              }
            });

           response.purposeIcon=icon.purposeIcon[0]?.path 
          await response.save();
        }else{
            console.log('failed to save icon image');
            
        }
    }
    
     res.status(200).json({message:'purpose Updated successfully ...',response})
     
   } catch (error) {
    
    console.log('Internal server error while updating Type of  purpose : ',error);
    res.status(500).json({message:'Internal server error while updating type of purpose'})
   }

}

const addPurposeToSociety=async(req,res)=>{
    const societyId=req.params.id;
    // console.log(req.body,societyId);
    
    try {
        const society=await Society.findById(societyId)
        // console.log(society);    
        
        const abc = req.body.filter((entry) =>
            !society.purposeList.some((data) => data.toString() === entry)
          );
        //   console.log('abc', abc);
          abc.forEach((entry) => {
            society.purposeList.push(new mongoose.Types.ObjectId(entry));
          });
          await society.save();
       
        res.send(req.body)
        
    } catch (error) {
        console.log('Internal server error while Adding Type of Entry to society: ',error);
        res.status(500).json({message:'Internal server error while Adding Type of Entry to society'}) 
    }
}

const getPurposeListOfSociety=async(req,res)=>{
    const societyId=req.params.id;
    // console.log(societyId);
    
    try {
        const response= await Society.findOne({_id:societyId}).populate("purposeList");
        
        if(!response){
            return res.status(500).json({message:`No Society Found !`})
        }

        res.status(200).json({message:'Society Data :',response})
        
    } catch (error) {
        console.log('Error while geting society Purpose data', error);
        return res.status(500).json({ message: 'Internal server error while geting society purpose data'});
    }

}

const removePurposeFromSociety=async(req,res)=>{
    const id=req.params.id;
    const {RemoveId}=req.body
    // console.log(RemoveId,id);
        

    try {
        const society=await Society.findById(id)
        // console.log(society);
        
        const abc = society.purposeList.filter((entry) => 
            entry.toString() !== RemoveId
          );
        //   console.log('abc', abc);
          
         society.purposeList=abc;
          
          await society.save();
       
        res.send(society)
        
    } catch (error) {
        console.log('Internal server error while Removing purpose from society: ',error);
        res.status(500).json({message:'Internal server error while purpose from society'}) 
    }

}


export {addPurpose,getAllPurposes,removePurpose,editPurpose,addPurposeToSociety,getPurposeListOfSociety,removePurposeFromSociety}