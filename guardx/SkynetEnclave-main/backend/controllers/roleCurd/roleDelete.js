
const User = require("../../Models/rolesSchema/rolesSchema");
exports.deleteRole = async (req, res) => {
    const id = req.params.id
    try {
        const deleteRole = await User.findByIdAndDelete(id)
        if (!deleteRole) {
            return res.status(404).json({
                success: false,
                msg: 'Role not found',
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Role is Deleted"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Role is not Deleted"
        })
    }
}
