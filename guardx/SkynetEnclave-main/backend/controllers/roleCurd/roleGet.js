const User = require("../../Models/rolesSchema/rolesSchema");

exports.getRole = async (req, res) => {
    try {
        const roles = await User.find();
        return res.status(200).json({
            success: true,
            msg: 'Roles retrieved!',
            roles: roles,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Server error',
        });
    }
}
