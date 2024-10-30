const User = require("../../Models/rolesSchema/rolesSchema");

exports.createRole = async (req, res) => {
    const { title, desc, permissions,createdBy, defaultPermissionLevel, roleTypeLevelSociety  } = req.body;

    try {
        const existingTitle = await User.findOne({ title })
        if (existingTitle) {
            return res.status(400).json({
                success: false,
                msg: 'Title is already exists',
            });
        }
        const newRole = await User.create({ title, desc, permissions,createdBy, defaultPermissionLevel, roleTypeLevelSociety  });
        return res.status(201).json({
            success: true,
            msg: 'Role created!',
            role: newRole,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Server error',
        });
    }
};
