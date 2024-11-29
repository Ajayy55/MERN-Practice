import {Router} from 'express'
import { memberSession } from '../controllers/attendance.controller.js';


const router= Router();
router.post('/memberSession',memberSession);


export default router;