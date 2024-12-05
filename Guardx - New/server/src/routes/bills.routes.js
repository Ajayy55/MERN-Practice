import {Router} from 'express';
import { createBill,calculateSocietyBill,genrateAutomaticBills} from '../controllers/bills.controller.js';


const router=Router();


router.post('/createBill',createBill)
router.post('/calculateSocietyBill',calculateSocietyBill)
router.post('/genrateAutomaticBills',genrateAutomaticBills)

export default router;