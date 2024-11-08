const {Router} = require ('express');
const { registerUser,loginUser ,SignInWithGoogle,validateOTP,ResetPassword} = require('../controllers/user.controllers');

const router=Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/SignInWithGoogle',SignInWithGoogle)
router.post('/validateOTP',validateOTP)
router.post('/ResetPassword',ResetPassword)


module.exports=router