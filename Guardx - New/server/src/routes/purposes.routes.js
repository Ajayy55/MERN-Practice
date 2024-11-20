import {Router} from 'express'
import { upload } from '../utils/Multer.js';
import { addPurpose,getAllPurposes,removePurpose,editPurpose
         ,addPurposeToSociety,getPurposeListOfSociety,removePurposeFromSociety
} from '../controllers/purposes.controller.js';

const router=Router();

router.post('/addPurpose',upload.fields([{ name: 'purposeIcon', maxCount: 1 }]),addPurpose);
router.get('/getAllPurposes',getAllPurposes);
router.delete('/removePurpose/:id',removePurpose);
router.patch('/editPurpose',upload.fields([{ name: 'purposeIcon', maxCount: 1 }]),editPurpose);
router.post('/addPurposeToSociety/:id',addPurposeToSociety);
router.get('/getPurposeListOfSociety/:id',getPurposeListOfSociety);
router.patch('/removePurposeFromSociety/:id',removePurposeFromSociety);


export default router;