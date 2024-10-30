const signUpSchema = require('../Models/signUpSchema'); 
exports.editSettingimage = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const imageUrl = req.file?.path;
        const userData = await signUpSchema.findById(id);

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        userData.Ownerimage = imageUrl;
        await userData.save();

        res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Failed to update user data' });
    }
};