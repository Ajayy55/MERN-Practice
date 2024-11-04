const mongoose =require('mongoose');

module.exports =DbConnection=async()=>{
    try {
        await mongoose.connect(`${process.env.URI}/firebase`)
        console.log('Mongo Db Connected ..!');
        
    } catch (error) {
        console.log('Mongo Db Connection Failed : ',error);
    }
}