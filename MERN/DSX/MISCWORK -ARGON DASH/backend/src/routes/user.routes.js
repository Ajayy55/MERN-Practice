import { Router } from "express";
import { registerUser ,userLogin,userProfile,setProfilePicture} from "../controllers/user.controller.js";
import { upload } from "../utils/multer.js";

const router=Router();

router.post('/register',registerUser);
router.post('/login',userLogin);
router.get('/userProfile/:id',userProfile);
router.post('/userProfile/:id',userProfile);
router.post('/setProfilePicture/:id',upload.single('file'),setProfilePicture);


export default router;




