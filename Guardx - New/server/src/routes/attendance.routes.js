import {Router} from 'express'


import { memberSession 
    ,handleRegularEntryClockIn,
    handleRegularEntryClockOut,
    viewRegularEntryAttendance,

} from '../controllers/attendance.controller.js';


const router= Router();
router.get('/memberSession',memberSession);
router.post('/handleRegularEntryClockIn',handleRegularEntryClockIn);
router.post('/handleRegularEntryClockOut',handleRegularEntryClockOut);
router.post('/viewRegularEntryAttendance',viewRegularEntryAttendance);


export default router;