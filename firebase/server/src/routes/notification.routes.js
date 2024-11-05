const {Router} = require ('express');
const {sendPushNotification,
    StaffLoginNotifyAdmin,
    SendOTPNotification

}  = require('./../controllers/notifications.controllers.js')

const router=Router();

router.post('/sendPushNotification',sendPushNotification)
router.post('/StaffLoginNotifyAdmin',StaffLoginNotifyAdmin)
router.post('/SendOTPNotification',SendOTPNotification)

module.exports =router