const user=require("../Models/Verified")
exports.getMaidEntry=async(req,res)=>{
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
}
exports.deleteMaidEntry = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedEntry = await user.findByIdAndDelete(id); 

        if (!deletedEntry) {
            return res.status(404).json({ success: false, msg: "Entry not found" });
        }

        return res.status(200).json({ success: true, msg: "Delete HouseMaid", deletedEntry });
    } catch (error) {
        console.error("Delete HouseMaid", error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
}