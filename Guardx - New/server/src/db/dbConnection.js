import mongoose from "mongoose";

export const dbConnection=async()=>{
    try {
        
        if( await mongoose.connect(`${process.env.URI}/NewGuardX`)){
        // if (await mongoose.connect(`${process.env.URI}/Guardx`)){
            console.log('Mongo DB connected ..!');
        }
        else{
            console.log('Mongo DB connection failed  ..!');
        }
        
        
    } catch (error) {
        console.log('mongo Db failed to connected');
        
    }
}