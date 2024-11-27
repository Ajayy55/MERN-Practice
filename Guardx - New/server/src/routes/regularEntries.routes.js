import {Router} from 'express';
import { addRegularEntry } from '../controllers/regularEntries.controller.js';
import { upload } from '../utils/Multer.js';

const router=Router();

router.post('/addRegularEntry',upload.fields([
    { name: 'regularAadharImage', maxCount: 1 },
    { name: 'regularProfileImage', maxCount: 1 },]),addRegularEntry)


export default router;upload