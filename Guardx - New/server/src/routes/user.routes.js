import {Router} from 'express'
import { createSuperAdmin,registerUser,login } from '../controllers/user.controller.js';
import { upload } from '../utils/Multer.js';

const router= Router();

router.post('/createSuperAdmin',createSuperAdmin);
router.post('/register', upload.fields([
    { name: 'rwaImage', maxCount: 1 },
    { name: 'rwaDocument', maxCount: 1 }]),registerUser);

router.post('/login',login)



export default router;


