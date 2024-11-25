import {Router} from 'express'
import { registerHouse,addHouseByAdmin,getHouseListBySocietyId,handleApprovalStatus,removeHouse,editHouse} from '../controllers/house.controller.js';
import { upload } from '../utils/Multer.js';

const router= Router();

router.post('/registerHouse',registerHouse);
router.post('/addHouseByAdmin',addHouseByAdmin);
router.get('/getHouseListBySocietyId/:id',getHouseListBySocietyId);
router.patch('/handleApprovalStatus',handleApprovalStatus);
router.delete('/removeHouse/:id',removeHouse);
router.patch('/editHouse', upload.fields([
    { name: 'ownerImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 }]),editHouse);

export default router;getHouseListBySocietyId