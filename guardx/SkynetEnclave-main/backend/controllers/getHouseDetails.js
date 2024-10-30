const user = require('../Models/houseSchema')

exports.getHouseDetails = async(req , res)=>{
    try {
        const response = await user.find()
        res.status(200).json({
            success: true,
            data: response
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            error: error.message
          });
        }
      };