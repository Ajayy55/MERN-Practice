import {Router} from'express';
import { upload } from '../utils/Multer.js';
import { addTypeOfEntry,getTypeOfEntryById,removeTypeOfEntry,editTypeOfEntry,getTypeOfEntriesByCreatedBy,addTypesOfEntriesToSociety,
    getTypesOfEntriesOfSociety,removeTypeOfEntryFromSociety
} from '../controllers/entries.controller.js';



const router=Router();

router.post('/addTypeOfEntry',upload.fields([{ name: 'entryIcon', maxCount: 1 }]),addTypeOfEntry);
router.get('/getTypeOfEntryById/:id',getTypeOfEntryById);
router.delete('/removeTypeOfEntry/:id',removeTypeOfEntry);
router.patch('/editTypeOfEntry',upload.fields([{ name: 'entryIcon', maxCount: 1 }]),editTypeOfEntry);
router.get('/getTypeOfEntriesByCreatedBy',getTypeOfEntriesByCreatedBy);
router.post('/addTypesOfEntriesToSociety/:id',addTypesOfEntriesToSociety);
router.get('/getTypesOfEntriesOfSociety/:id',getTypesOfEntriesOfSociety);
router.patch('/removeTypeOfEntryFromSociety/:id',removeTypeOfEntryFromSociety);




export default router;