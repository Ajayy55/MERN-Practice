import mongoose from "mongoose";

export const dbConnection=async()=>{
    try {
        
        await mongoose.connect(`${process.env.URI}/NewGuardX`);
        console.log('Mongo DB connected ..!');
        
    } catch (error) {
        console.log('mongo Db failed to connected');
        
    }
}