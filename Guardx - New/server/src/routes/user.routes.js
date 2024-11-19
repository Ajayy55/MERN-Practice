import {Router} from 'express'
import { createSuperAdmin,registerUser,login,getPemissions,getUsersByCreatedBy,removeUser,getUserRoles,addUserRoles,removeUserRole,EditUserRoles,
    getUsersBySocietyId
    
} from '../controllers/user.controller.js';
import { upload } from '../utils/Multer.js';

const router= Router();

router.post('/createSuperAdmin',createSuperAdmin);
router.post('/register', upload.fields([
    { name: 'rwaImage', maxCount: 1 },
    { name: 'rwaDocument', maxCount: 1 }]),registerUser);

router.post('/login',login)
router.post('/getPemissions',getPemissions)
router.get('/getUsersByCreatedBy/:id',getUsersByCreatedBy)
router.delete('/removeUser/:id',removeUser);
router.get('/getUserRoles/:id',getUserRoles)
router.post('/addUserRoles',addUserRoles)
router.delete('/removeUserRole/:id',removeUserRole)
router.put('/EditUserRoles',EditUserRoles)
router.get('/getUsersBySocietyId/:id',getUsersBySocietyId)



export default router;


