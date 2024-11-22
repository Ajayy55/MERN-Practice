import {Router} from 'express'
import { registerHouse,addHouseByAdmin,getHouseListBySocietyId} from '../controllers/house.controller.js';

const router= Router();

router.post('/registerHouse',registerHouse);
router.post('/addHouseByAdmin',addHouseByAdmin);
router.get('/getHouseListBySocietyId/:id',getHouseListBySocietyId);


export default router;getHouseListBySocietyId