const {Router} = require ('express');
const { registerUser,loginUser ,SignInWithGoogle} = require('../controllers/user.controllers');

const router=Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/SignInWithGoogle',SignInWithGoogle)


module.exports=router