import {Router} from 'express';
import { addSociety,getSocietyBySocietyID,getSocietyBycreatedBy,editSociety,removeSociety} from '../controllers/society.controller.js';
import { upload } from '../utils/Multer.js';

const router=Router();

router.post('/addSociety', upload.fields([
    { name: 'societyLogo', maxCount: 1 },
    { name: 'SocietyDocuments', maxCount: 1 }]),addSociety);

router.get('/getSocietyBySocietyID/:id',getSocietyBySocietyID);
router.get('/getSocietyBycreatedBy/:id',getSocietyBycreatedBy);
router.put('/editSociety/:id',upload.fields([
    { name: 'societyLogo', maxCount: 1 }]),editSociety)

router.delete('/removeSociety/:id',removeSociety)

export default router;