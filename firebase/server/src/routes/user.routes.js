const {Router} = require ('express');
const { registerUser,loginUser ,SignInWithGoogle,sendPushNotification} = require('../controllers/user.controllers');

const router=Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/SignInWithGoogle',SignInWithGoogle)
router.post('/sendPushNotification',sendPushNotification)


module.exports=router