const user = require('../Models/nonVerify');

exports.delUser = async (req, res) => {
    let userId = req.params.id;

    try {
        let result = await user.findByIdAndDelete(userId);
        if (result) {
            return res.status(201).json({
                msg: "Data deleted successfully",
                data: result 
            });
        }
    } catch (error) {
        return res.status(401).json({
            msg: "Data not deleted"
        });
    }
};
