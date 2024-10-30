const User = require("../../Models/rolesSchema/rolesSchema"); // Import your Mongoose model for roles
exports.roleGetEdit = async (req, res) => {
    const id = req.params.id
    try {
        const getEditData = await User.findById(id)
        if (!getEditData) {
            return res.status(404).json({
                success: false,
                msg: 'Role not found',
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Role data retrieved successfully",
            getEditData: getEditData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to retrieve role data"
        })
    }
}
