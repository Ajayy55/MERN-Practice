const user = require('../Models/enrtySchema')

exports.getUserEnties = async(req , res) =>{
try {
    const entries = await user.find()
    res.status(200).json({
        success: true,
        data: entries
      });
    
} catch (error) {
    res.status(500).json({
        success: false,
        error: error.message
      });
}

}