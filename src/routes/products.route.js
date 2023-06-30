import { Router } from "express";
import { getProducts, postProduct, getProductById, putProductById, deleteProductById } from '../controllers/products.controller.js'

const router = Router();

//Ruta /products + query limits
router.route('/')
    .get(getProducts)
    .post(postProduct);

//Ruta /products/:id Busco producto por ID 
router.route('/:pid')
    .get(getProductById)
    .put(putProductById)
    .delete(deleteProductById);

export default router;