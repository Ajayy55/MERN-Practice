import { Router } from "express";
import { addProduct ,allProducts,removeProduct,editProduct} from "../controllers/products.controller.js";
import { upload } from "../utils/multer.js";


const router=Router();

router.post('/addProduct',upload.array('files',6),addProduct)
router.get('/allProducts',allProducts)
router.delete('/removeProduct/:id',removeProduct)
router.patch('/editProduct/:id',editProduct)


export default router;
