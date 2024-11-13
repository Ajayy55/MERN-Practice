import { Society } from "../models/society.model.js";
import fs from 'fs'

const addSociety=async(req,res)=>{
    const {name,address,city,state,contact,createdBy,houseCount} =req.body;
    const files = req.files;
    // console.log(req.body);
    // console.log(req.files);
    
    if(!name|| !address|| !city|| !state|| !contact||  !createdBy|| !houseCount){
        return res.status(400).json({message:'Pls fill all required fields'})
    }
try {
    
        const isSocietyExisted = await Society.findOne({ name, city });
        if(isSocietyExisted){
            return res.status(400).json({message:`Same Society Already Existed in ${city}`})
        }
    
        const addSociety=await Society.create({...req.body});

        if(!addSociety){
            return res.status(500).json({message:`Something went wrong while Adding society`})
        }
        
        if(files){
            if (files.societyLogo && files.societyLogo[0]) {
                addSociety.societyLogo = files.societyLogo[0].path;  
              }
            if (files.SocietyDocuments && files.SocietyDocuments[0]) {
                addSociety.SocietyDocuments = files.SocietyDocuments[0].path;  
              }
              await addSociety.save(); 
        }


        res.status(201).json({message:'society created succesffuly',addSociety})
} catch (error) {
    console.log('Error while adding society', error);
    return res.status(500).json({ message: 'Internal server error while adding society'});
}
}

const getSocietyBySocietyID=async(req,res)=>{
    const id=req.params.id;

    try {
        const response= await Society.findOne({_id:id})
        if(!response){
            return res.status(500).json({message:`No Society Found !`})
        }

        res.status(200).json({message:'Society Data :',response})
        
    } catch (error) {
        console.log('Error while geting society data', error);
        return res.status(500).json({ message: 'Internal server error while geting society data'});
    }
    
}

const getSocietyBycreatedBy=async(req,res)=>{
    const id=req.params.id;

    try {
        const response= await Society.find({createdBy:id})
        if(!response){
            return res.status(500).json({message:`No Society Found !`})
        }

        res.status(200).json({message:'Society Data :',response})
        
    } catch (error) {
        console.log('Error while geting society data', error);
        return res.status(500).json({ message: 'Internal server error while geting society data'});
    }
    
}

const editSociety=async(req,res)=>{
    const {name,address,city,state,contact,createdBy,houseCount} =req.body;
    const files = req.files;
    const id=req.params.id;

    // console.log('body',req.body);
    // console.log('file',req.file);
    
    if(!name|| !address|| !city|| !state|| !contact|| !createdBy|| !houseCount){
        return res.status(400).json({message:'Pls fill all required fields'})
    }

try {
        const updateSociety =await Society.findByIdAndUpdate(id,{...req.body},{new:true})

    //    console.log(updateSociety.societyLogo);
       
        
        if(files){
            if (files.societyLogo && files.societyLogo[0]) {
                if (updateSociety.societyLogo) {
                    await fs.unlink(updateSociety.societyLogo,(error) => console.error('Failed to delete old logo:', error));
                }
                updateSociety.societyLogo = files.societyLogo[0].path;  
              }
            if (files.SocietyDocuments && files.SocietyDocuments[0]) {
                updateSociety.SocietyDocuments = files.SocietyDocuments[0].path;  
              }
              await updateSociety.save(); 
        }

        if(!updateSociety){
            return res.status(400).json({message:'Something went wrong while Updating Society'})
        }


        res.status(200).json({message:'Society data updated ..!'})
} catch (error) {
    console.log('Error while updating society data', error);
        return res.status(500).json({ message: 'Internal server error while updating society data'});
}
}

const removeSociety=async(req,res)=>{
    const id=req.params.id;

    try {
        
        const response=await Society.findByIdAndDelete(id)
        if(!response){
            return res.status(400).json({message:'Something went wrong while deleting Society'})
        }

        res.status(200).json({message:'Society removed succesfully '})

    } catch (error) {
        console.log('Error while deleting society data', error);
        return res.status(500).json({ message: 'Internal server error while deleting society data'}); 
    }
}

export {addSociety,getSocietyBySocietyID,getSocietyBycreatedBy,editSociety,removeSociety }