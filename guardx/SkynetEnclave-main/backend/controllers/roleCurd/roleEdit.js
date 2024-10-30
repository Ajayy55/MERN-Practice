
const User = require("../../Models/rolesSchema/rolesSchema"); // Import your Mongoose model for roles
exports.editRole = async (req, res) => {
    const  id  = req.params.id; // Extract ID from URL parameters
    const { title, desc, permissions, roleTypeLevelSociety } = req.body; // Extract updated role information from request body

    try {
        // Check if the ID is valid before attempting to update
        if (!id) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid role ID provided',
            });
        }

        // Update the role in the database 
        const updatedRole = await User.findByIdAndUpdate(id,{ title, desc, permissions, roleTypeLevelSociety }, { new: true });

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                msg: 'Role not found',
            });
        }

        // Role successfully updated
        return res.status(200).json({
            success: true,
            msg: 'Role updated successfully',
            role: updatedRole,
        });

    } catch (error) {
        console.error('Error updating role:', error);
        return res.status(500).json({
            success: false,
            msg: 'Role could not be updated',
        });
    }
};
