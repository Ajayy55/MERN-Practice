import {Router} from 'express'


import { memberSession ,
    viewMemberAttendance,
    handleRegularEntryClockIn,
    handleRegularEntryClockOut,
    viewRegularEntryAttendance,

} from '../controllers/attendance.controller.js';


const router= Router();
router.post('/memberSession',memberSession);
router.get('/viewMemberAttendance/:id',viewMemberAttendance);

router.post('/handleRegularEntryClockIn',handleRegularEntryClockIn);
router.post('/handleRegularEntryClockOut',handleRegularEntryClockOut);
router.post('/viewRegularEntryAttendance',viewRegularEntryAttendance);


export default router;