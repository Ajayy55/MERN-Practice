import { EntryList } from "../models/entriesList.model.js";
import { Society } from "../models/society.model.js";
import mongoose from 'mongoose'
import fs from 'fs';
const addTypeOfEntry =async(req,res)=>{
    const {title,entryType,createdBy}=req.body;
    const icon=req.files;

    if(!title ||!entryType || !createdBy){
        return res.status(400).json({message:'All fields Required'});
    }
try {
    
        const isIconExists =await EntryList.findOne({title})
        if(isIconExists){
            return res.status(400).json({message:'Title with same name already Exists'});
        }  
    
        const newEntryListItem= new EntryList({...req.body})
    
        if(icon){
            if(icon.entryIcon[0])
            {
               newEntryListItem.icon=icon.entryIcon[0]?.path 
            }else{
                console.log('failed to save icon image');
                
            }
        }
    
        const response=await newEntryListItem.save()
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
const getTypeOfEntriesByCreatedBy=async(req,res)=>{

    // const userid=req.params.id;
    // console.log(id);
    
   try {
     const response=await EntryList.find({})
     if(!response){
        return res.status(500).json({message:'Something Went wrong Entry Not Found'})
     }

     res.status(200).json({message:'Entry Found',response})


   } catch (error) {
    console.log('Internal server error while geting Type of Entry : ',error);
    res.status(500).json({message:'Internal server error while geting type of entry'})
   }
}

const getTypeOfEntryById=async(req,res)=>{

    const id=req.params.id;
    // console.log(id);
    
   try {
     const response=await EntryList.findOne({_id:id})
     if(!response){
        return res.status(500).json({message:'Something Went wrong Entry Not Found'})
     }

     res.status(200).json({message:'Entry Found',response})


   } catch (error) {
    console.log('Internal server error while geting Type of Entry : ',error);
    res.status(500).json({message:'Internal server error while geting type of entry'})
   }
}

const removeTypeOfEntry=async(req,res)=>{
    const id=req.params.id;
    // console.log(id);
    
   try {
     const response=await EntryList.findByIdAndDelete(id)
     if(!response){
        return res.status(500).json({message:'Something Went wrong while Removing Entry'})
     }

     res.status(200).json({message:'Entry Removed Successfully',response})


   } catch (error) {
    console.log('Internal server error while removing Type of Entry : ',error);
    res.status(500).json({message:'Internal server error while removing type of entry'})
   } 
}

const editTypeOfEntry=async(req,res)=>{
    const {id}=req.body;
    const icon=req.files;

    const {title,entryType,createdBy}=req.body;
 

    if(!title ||!entryType || !createdBy){
        return res.status(400).json({message:'All fields Required'});
    }

   try {
     const entry=await EntryList.findOne({_id:id})
    //  console.log(entry);
     
     if(!entry){
        return res.status(400).json({message:'Entry not Found in Db'})
     }

     const response=await EntryList.findByIdAndUpdate(id,req.body,{new:true})
     if(!entry){
        return res.status(500).json({message:'Something went wrong while updating Entry'})
     }

     if(icon){
        if(icon.entryIcon[0])
        {            
            fs.unlink(entry.icon, (err) => {
                if (err) {
                  console.error("Failed to delete the old icon: ", err);
                } else {
                  console.log("Old icon deleted successfully");
                }
              });
            

           response.icon=icon.entryIcon[0]?.path 
          await response.save();
        }else{
            console.log('failed to save icon image');
            
        }
    }
     res.status(200).json({message:'Entry Updated successfully ...',response})
     
   } catch (error) {
    
    console.log('Internal server error while updating Type of Entry : ',error);
    res.status(500).json({message:'Internal server error while updating type of entry'})
   }

}

const addTypesOfEntriesToSociety=async(req,res)=>{
    const id=req.params.id;
    console.log(req.body,id);
    if(id==='null'){
        return res.status(404).json({message:'UnAuthorized Action Invalid Society '})
    }
    try {
        const society=await Society.findById(id)
        console.log(society);
        if(!society){
            return res.status(404).json({message:'UnAuthorized Action Society Admin can add Entries'})
        }
        const abc = req.body.filter((entry) =>
            !society.typeOfEntries.some((data) => data.toString() === entry)
          );
        //   console.log('abc', abc);
          abc.forEach((entry) => {
            society.typeOfEntries.push(new mongoose.Types.ObjectId(entry));
          });
          await society.save();
       
        res.send(req.body)
        
    } catch (error) {
        console.log('Internal server error while Adding Type of Entry to society: ',error);
        res.status(500).json({message:'Internal server error while Adding Type of Entry to society'}) 
    }

}

const getTypesOfEntriesOfSociety=async(req,res)=>{
    const id=req.params.id;

    try {
        const response= await Society.findOne({_id:id}).populate("typeOfEntries").select("typeOfEntries");
        if(!response){
            return res.status(500).json({message:`No Society Found !`})
        }

        res.status(200).json({message:'Society Data :',response})
        
    } catch (error) {
        console.log('Error while geting society data', error);
        return res.status(500).json({ message: 'Internal server error while geting society data'});
    }
    
}

const removeTypeOfEntryFromSociety=async(req,res)=>{
    const id=req.params.id;
    const {RemoveId}=req.body
    console.log(RemoveId,id);
        

    try {
        const society=await Society.findById(id)
        console.log(society);
        
        const abc = society.typeOfEntries.filter((entry) => 
            entry.toString() !== RemoveId
          );
          console.log('abc', abc);
          
         society.typeOfEntries=abc;
          
          await society.save();
       
        res.send(society)
        
    } catch (error) {
        console.log('Internal server error while Removing Type of Entry to society: ',error);
        res.status(500).json({message:'Internal server error while Removing Type of Entry to society'}) 
    }

}




export {addTypeOfEntry,getTypeOfEntryById,removeTypeOfEntry,editTypeOfEntry,getTypeOfEntriesByCreatedBy,addTypesOfEntriesToSociety,
    getTypesOfEntriesOfSociety,removeTypeOfEntryFromSociety}