import {Router} from 'express';
import { upload } from '../utils/Multer.js';
import { addRegularEntry ,getSocietyRegularEntryById,removeRegularEntry,editRegularEntry} from '../controllers/regularEntries.controller.js';


const router=Router();

router.post('/addRegularEntry',upload.fields([
    { name: 'regularAadharImage', maxCount: 2 },
    { name: 'regularProfileImage', maxCount: 1 },]),addRegularEntry);
router.patch('/editRegularEntry',upload.fields([
    { name: 'regularAadharImage', maxCount: 2 },
    { name: 'regularProfileImage', maxCount: 1 },]),editRegularEntry);
router.post('/getSocietyRegularEntryById',getSocietyRegularEntryById);
router.delete('/removeRegularEntry/:id',removeRegularEntry);


export default router;upload