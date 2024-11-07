import {Router} from 'express'
import { registerHouse } from '../controllers/house.controller.js';

const router= Router();

router.post('/registerHouse',registerHouse);


export default router;