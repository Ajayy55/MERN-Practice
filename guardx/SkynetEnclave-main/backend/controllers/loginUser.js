
const jwt = require('jsonwebtoken');
const User = require('../Models/signUpSchema');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await User.findOne({ username });
        if (!userData) {
            return res.status(401).json({
                success: false,
                msg: "User not found" 
            });
        }
        if (userData.password !== password) {
            return res.status(401).json({
                success: false,
                msg: "Invalid password" 
            });
        }

        // Create a token with a specific expiration time
        const token = jwt.sign(
            { id: userData._id, username: userData.username },
            'Skynetenclave_is_my_secret_key', 
            { expiresIn: '3h' } 
        );

        return res.status(200).json({
            success: true,
            msg: "Login successful",
            token: token,
            userData: userData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};
