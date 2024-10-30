const user = require('../Models/nonVerify')


exports.getNonVerifiedData = async (req, res) => {
    try {
      const nonVerifiedData = await user.find();
  
      res.status(200).json({
        success: true,
        data: nonVerifiedData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };