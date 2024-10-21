import { Router } from "express";
import { addProduct ,allProducts,removeProduct,editProduct,singleProduct} from "../controllers/products.controller.js";
import { upload } from "../utils/productsMulter.js";


const router=Router();

router.post('/addProduct',upload.array('files',16),addProduct)
router.get('/allProducts',allProducts)
router.get('/singleProduct/:id',singleProduct)
router.delete('/removeProduct/:id',removeProduct)
router.patch('/editProduct/:id',upload.array('files',16),editProduct)


export default router;
