const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://skynet:Skynet1234@cluster0.cpcygrb.mongodb.net/skynetenclave").then(()=>{
    console.log('MongoDb Connect')
})
